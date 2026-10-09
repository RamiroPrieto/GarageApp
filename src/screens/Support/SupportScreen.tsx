import { ScrollView, Text } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button';
import { sendSupportRequest } from '../../api/users.api';
import { useI18n } from '../../context/I18nContext';
import { RootStackParamList } from '../../navigation/navigation.types';
import { styles } from '../EditProfile/EditProfile.styles';
import { useDialog } from '../../context/DialogContext';

export function SupportScreen() {
  const { t } = useI18n(); const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Support'>>();
  const { show } = useDialog();
  const [subject, setSubject] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const send = async () => {
    if (subject.trim().length < 3 || message.trim().length < 10) { show(t('common.error'), t('support.required'), [{ text: t('common.ok') }]); return; }
    try { setLoading(true); await sendSupportRequest(subject.trim(), message.trim()); show(t('support.successTitle'), t('support.successMessage'), [{ text: t('common.ok'), onPress: () => navigation.goBack() }]); }
    catch (error) { show(t('common.error'), error instanceof Error ? error.message : t('common.unknownError'), [{ text: t('common.ok') }]); }
    finally { setLoading(false); }
  };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><Text style={styles.eyebrow}>{t('support.eyebrow')}</Text><Text style={styles.title}>{t('support.title')}</Text><Text style={styles.photoHint}>{t('support.subtitle')}</Text><Text style={{ height: 18 }} /><Input label={t('support.subject')} value={subject} onChangeText={setSubject} /><Input label={t('support.message')} value={message} onChangeText={setMessage} multiline numberOfLines={7} style={{ height: 140, textAlignVertical: 'top', paddingTop: 16 }} /><Button title={t('support.send')} onPress={() => void send()} loading={loading} /></ScrollView>;
}
