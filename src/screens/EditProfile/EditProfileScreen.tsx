import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button';
import { confirmPhoneChange, requestPhoneChange, updateMyProfile } from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { RootStackParamList } from '../../navigation/navigation.types';
import { styles } from './EditProfile.styles';
import { useDialog } from '../../context/DialogContext';

export function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const { t } = useI18n();
  const { show } = useDialog();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'EditProfile'>>();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [profileImage, setProfileImage] = useState(user?.profileImage ?? null);
  const [loading, setLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { show(t('common.error'), t('profile.photoPermission'), [{ text: t('common.ok') }]); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: true });
    if (result.canceled || !result.assets[0]?.base64) return;
    const asset = result.assets[0];
    setProfileImage(`data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`);
  };

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) { show(t('common.error'), t('profile.required'), [{ text: t('common.ok') }]); return; }
    try {
      setLoading(true);
      await updateMyProfile({ firstName: firstName.trim(), lastName: lastName.trim(), profileImage });
      const nextPhone = phone.trim();
      if (nextPhone && nextPhone !== user?.phone) {
        await requestPhoneChange(nextPhone);
        setPendingPhone(nextPhone);
        return;
      }
      await refreshUser();
      navigation.goBack();
    } catch (error) {
      show(t('common.error'), error instanceof Error ? error.message : t('common.unknownError'), [{ text: t('common.ok') }]);
    } finally { setLoading(false); }
  };

  const confirmPhone = async () => {
    if (!/^\d{4,10}$/.test(verificationCode)) { show(t('common.error'), t('profile.invalidVerificationCode'), [{ text: t('common.ok') }]); return; }
    try {
      setLoading(true);
      await confirmPhoneChange(verificationCode);
      await refreshUser();
      navigation.goBack();
    } catch (error) {
      show(t('common.error'), error instanceof Error ? error.message : t('common.unknownError'), [{ text: t('common.ok') }]);
    } finally { setLoading(false); }
  };

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'U';
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>{t('profile.eyebrow')}</Text><Text style={styles.title}>{t('profile.title')}</Text>
    <Pressable style={styles.photoButton} onPress={() => void pickImage()}>{profileImage ? <Image source={{ uri: profileImage }} style={styles.photo} /> : <Text style={styles.avatar}>{initials}</Text>}<View style={styles.camera}><Text style={styles.cameraText}>+</Text></View></Pressable>
    <Text style={styles.photoHint}>{t('profile.changePhoto')}</Text>
    <View style={styles.form}><Input label={t('profile.firstName')} value={firstName} onChangeText={setFirstName} /><Input label={t('profile.lastName')} value={lastName} onChangeText={setLastName} /><Input label={t('profile.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!pendingPhone} /><Input label={t('profile.email')} value={user?.email ?? ''} editable={false} />
      {pendingPhone && <><Text style={styles.phoneVerificationHint}>{t('profile.phoneVerificationHint', { phone: pendingPhone })}</Text><Input label={t('profile.verificationCode')} value={verificationCode} onChangeText={setVerificationCode} keyboardType="number-pad" maxLength={10} /></>}
    </View>
    <Button title={pendingPhone ? t('profile.confirmPhone') : t('profile.save')} onPress={() => void (pendingPhone ? confirmPhone() : save())} loading={loading} />
  </ScrollView>;
}
