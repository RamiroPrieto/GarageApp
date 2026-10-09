import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { confirmOwnerReservationStart, getMyReservations } from '../../api/reservation.api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { RootStackParamList } from '../../navigation/navigation.types';
import { Reservation } from '../../types/reservation.types';
import { formatCurrency } from '../../utils/currency';
import { colors } from '../../theme/colors';
import { styles } from '../Reservations/Reservations.styles';

export function OwnerBookingsScreen() {
  const { user } = useAuth(); const { t, dateLocale } = useI18n(); const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<Reservation[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { try { setError(null); setItems((await getMyReservations()).filter((item) => item.parking?.ownerId === user?.id)); } catch (e) { setError(e instanceof Error ? e.message : t('ownerReservations.loadError')); } finally { setLoading(false); } }, [t, user?.id]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const start = async (id: number) => { try { await confirmOwnerReservationStart(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : t('ownerReservations.startError')); } };
  const groups = useMemo(() => ({ pending: items.filter((r) => r.status === 'PENDING'), upcoming: items.filter((r) => r.status === 'CONFIRMED'), active: items.filter((r) => r.status === 'ACTIVE'), past: items.filter((r) => ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(r.status)) }), [items]);
  const render = (title: string, reservations: Reservation[]) => <><Text style={styles.sectionTitle}>{title}</Text>{reservations.length === 0 ? <Text style={styles.sectionEmpty}>{t('ownerReservations.empty')}</Text> : reservations.map((r) => { const startDate = new Date(r.startDatetime); return <Pressable key={r.id} onPress={() => navigation.navigate('BookingDetails', { reservationId: r.id })}><View style={styles.card}><View style={styles.cardHeader}><View style={styles.parkingInfo}><Text style={styles.parkingName}>{r.parking?.title}</Text><Text style={styles.address}>{t('ownerReservations.customer')}: {r.user?.firstName} {r.user?.lastName}</Text></View></View><View style={styles.detailsRow}><Text style={styles.time}>{startDate.toLocaleString(dateLocale, { dateStyle: 'short', timeStyle: 'short' })}</Text><Text style={styles.price}>{formatCurrency(r.totalPrice, r.currency, dateLocale)}</Text></View></View></Pressable>; })}</>;
  return <SafeAreaView style={styles.safeArea} edges={['top']}><ScrollView contentContainerStyle={styles.content}><Pressable onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable><Text style={styles.eyebrow}>{t('ownerReservations.eyebrow')}</Text><Text style={styles.title}>{t('ownerReservations.title')}</Text>{loading ? <View style={styles.state}><ActivityIndicator color={colors.primary} /></View> : error ? <Text style={styles.error}>{error}</Text> : <>{render(t('ownerReservations.pending'), groups.pending)}{render(t('ownerReservations.upcoming'), groups.upcoming)}{render(t('ownerReservations.active'), groups.active)}{render(t('ownerReservations.history'), groups.past)}</>}</ScrollView></SafeAreaView>;
}
