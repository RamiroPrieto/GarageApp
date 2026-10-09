import { useRef, useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStripe } from '@stripe/stripe-react-native';
import { Button } from '../../components/Button';
import { CreditPurchaseStatus, getCreditPurchaseStatus, purchaseCredits } from '../../api/credits.api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { RootStackParamList } from '../../navigation/navigation.types';
import { globalStyles } from '../../theme/global.styles';
import { styles } from './BuyCreditsScreen.styles';
import { useDialog } from '../../context/DialogContext';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'BuyCredits'>;
type Phase = 'form' | 'processing' | 'pending';
const POLL_ATTEMPTS = 12;
const POLL_INTERVAL_MS = 1_000;

export function BuyCreditsScreen() {
  const [value, setValue] = useState('100');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>('form');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const purchaseInFlight = useRef(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user, refreshUser } = useAuth();
  const { t } = useI18n();
  const { show } = useDialog();
  const navigation = useNavigation<Navigation>();
  const credits = Number(value);
  const validCredits = Number.isInteger(credits) && credits > 0;
  const price = validCredits ? (credits / 100).toFixed(2) : '0.00';

  const waitForConfirmation = async (intentId: string): Promise<CreditPurchaseStatus> => {
    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      try {
        const purchase = await getCreditPurchaseStatus(intentId);
        if (purchase.status !== 'PENDING') return purchase.status;
      } catch {
        // A transient network error does not mean the payment failed; keep the
        // bounded wait and let the user refresh later if it times out.
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
    return 'PENDING';
  };

  const checkConfirmation = async (intentId = paymentIntentId) => {
    if (!intentId) return;
    setLoading(true);
    setPhase('processing');
    const status = await waitForConfirmation(intentId);
    setLoading(false);
    if (status === 'SUCCEEDED') {
      try {
        await refreshUser();
      } catch {
        // The purchase is confirmed, but do not present stale balance data as
        // successful. A bounded manual status check can retry the refresh.
        setPhase('pending');
        show(t('common.error'), t('credits.pendingMessage'), [{ text: t('common.ok') }]);
        return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
      return;
    }
    if (status === 'FAILED') {
      setPhase('form');
      show(t('common.error'), t('credits.paymentFailed'), [{ text: t('common.ok') }]);
      return;
    }
    setPhase('pending');
  };

  const pay = async () => {
    // React state updates asynchronously, so loading alone cannot prevent two
    // rapid taps from executing this handler twice.
    if (purchaseInFlight.current) return;
    if (!validCredits) { show(t('common.error'), t('credits.invalidAmount'), [{ text: t('common.ok') }]); return; }
    purchaseInFlight.current = true;
    try {
      setLoading(true);
      const data = await purchaseCredits(credits, `credit-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      setPaymentIntentId(data.paymentIntentId);
      const { error: initError } = await initPaymentSheet({ merchantDisplayName: 'GarageApp', paymentIntentClientSecret: data.clientSecret });
      if (initError) throw initError;
      const { error } = await presentPaymentSheet();
      if (error) {
        if (error.code !== 'Canceled') throw error;
        return;
      }
      // PaymentSheet success only means Stripe accepted the payment. The backend
      // webhook is the sole authority that changes the balance.
      setLoading(false);
      // Pass the id returned by the backend directly. setPaymentIntentId updates
      // React state on the next render, so reading the state here can still be null.
      await checkConfirmation(data.paymentIntentId);
    } catch (error) {
      setPhase('form');
      show(t('common.error'), error instanceof Error ? error.message : t('common.unknownError'), [{ text: t('common.ok') }]);
    } finally {
      purchaseInFlight.current = false;
      setLoading(false);
    }
  };

  const isProcessing = phase === 'processing';
  return <SafeAreaView style={globalStyles.screen}><View style={styles.content}>
    <Text style={styles.eyebrow}>GARAGEAPP</Text>
    <Text style={styles.title}>{t('credits.title')}</Text>
    <Text style={styles.subtitle}>{t('credits.rate')}</Text>
    <Text style={styles.balance}>{t('credits.currentBalance', { balance: user?.creditBalance ?? 0 })}</Text>
    {phase === 'form' && <><Text style={styles.label}>{t('reservation.credits')}</Text><TextInput value={value} onChangeText={setValue} keyboardType="number-pad" style={styles.input} placeholder="100" placeholderTextColor="#626B80" editable={!loading} /><View style={styles.card}><Text style={styles.cardLabel}>{t('credits.cost')}</Text><Text style={styles.price}>${price} USD</Text></View><Button title={t('credits.buy')} onPress={pay} loading={loading} /></>}
    {isProcessing && <View style={styles.card}><Text style={styles.stateTitle}>{t('credits.processingTitle')}</Text><Text style={styles.stateMessage}>{t('credits.processingMessage')}</Text></View>}
    {phase === 'pending' && <><View style={styles.card}><Text style={styles.stateTitle}>{t('credits.pendingTitle')}</Text><Text style={styles.stateMessage}>{t('credits.pendingMessage')}</Text></View><Button title={t('credits.checkStatus')} onPress={() => void checkConfirmation()} loading={loading} /><View style={styles.secondaryAction}><Button title={t('credits.backHome')} onPress={() => navigation.goBack()} /></View></>}
  </View></SafeAreaView>;
}
