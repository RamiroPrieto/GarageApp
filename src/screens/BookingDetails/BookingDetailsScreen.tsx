import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { confirmCustomerReservationStart, confirmOwnerReservationStart, getReservation } from '../../api/reservation.api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { RootStackParamList } from '../../navigation/navigation.types';
import { Reservation } from '../../types/reservation.types';
import { formatCurrency } from '../../utils/currency';
import { colors } from '../../theme/colors';
import { styles } from './BookingDetails.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;
export function BookingDetailsScreen({ route, navigation }: Props) {
  const { user } = useAuth(); const { t, dateLocale } = useI18n(); const [reservation, setReservation] = useState<Reservation | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [now, setNow] = useState(new Date());
  const load = useCallback(async () => { try { setError(null); setReservation(await getReservation(route.params.reservationId)); } catch (e) { setError(e instanceof Error ? e.message : t('reservations.loadError')); } finally { setLoading(false); } }, [route.params.reservationId, t]);
  useEffect(() => { void load(); const timer = setInterval(() => setNow(new Date()), 15_000); return () => clearInterval(timer); }, [load]);
  const start = async () => { if (!reservation) return; try { const owner = reservation.parking?.ownerId === user?.id; await (owner ? confirmOwnerReservationStart(reservation.id) : confirmCustomerReservationStart(reservation.id)); await load(); } catch (e) { setError(e instanceof Error ? e.message : t('reservations.startError')); } };
  if (loading) return <SafeAreaView style={styles.safeArea}><View style={styles.state}><ActivityIndicator color={colors.primary} /></View></SafeAreaView>;
  if (!reservation) return <SafeAreaView style={styles.safeArea}><View style={styles.state}><Text style={styles.error}>{error}</Text></View></SafeAreaView>;
  const startDate = new Date(reservation.startDatetime); const endDate = new Date(reservation.endDatetime); const isOwner = reservation.parking?.ownerId === user?.id; const canStart = reservation.status === 'CONFIRMED' && startDate.getTime() - now.getTime() <= 10 * 60 * 1000 && startDate >= now; const alreadyStarted = isOwner ? reservation.ownerStartedAt : reservation.customerStartedAt;
  const otherStarted = isOwner ? reservation.customerStartedAt : reservation.ownerStartedAt;
  return <SafeAreaView style={styles.safeArea} edges={['top']}><ScrollView contentContainerStyle={styles.content}><Pressable style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable><Text style={styles.eyebrow}>{isOwner ? t('bookingDetails.ownerEyebrow') : t('bookingDetails.customerEyebrow')}</Text><Text style={styles.title}>{reservation.parking?.title}</Text><View style={styles.card}><Text style={styles.label}>{t('bookingDetails.address')}</Text><Text style={styles.value}>{reservation.parking?.address}, {reservation.parking?.city}</Text><Text style={styles.label}>{t('bookingDetails.schedule')}</Text><Text style={styles.value}>{startDate.toLocaleString(dateLocale, { dateStyle: 'medium', timeStyle: 'short' })} — {endDate.toLocaleTimeString(dateLocale, { timeStyle: 'short' })}</Text><Text style={styles.label}>{t('bookingDetails.total')}</Text><Text style={styles.price}>{formatCurrency(reservation.totalPrice, reservation.currency, dateLocale)}</Text>{isOwner && <><Text style={styles.label}>{t('bookingDetails.customer')}</Text><Text style={styles.value}>{reservation.user?.firstName} {reservation.user?.lastName}</Text></>}</View><View style={styles.notice}><Ionicons name="information-circle-outline" size={20} color={colors.accent} /><Text style={styles.noticeText}>{t('bookingDetails.startInfo')}</Text></View>{canStart && !alreadyStarted && <Pressable style={styles.startButton} onPress={() => void start()}><Text style={styles.startText}>{t('reservations.start')}</Text></Pressable>}{alreadyStarted && !otherStarted && <Text style={styles.waiting}>{t('bookingDetails.waiting')}</Text>}{reservation.status === 'ACTIVE' && <Text style={styles.active}>{t('reservations.bookingStarted')}</Text>}{error && <Text style={styles.error}>{error}</Text>}</ScrollView></SafeAreaView>;
}
