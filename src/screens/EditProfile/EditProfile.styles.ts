import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingTop: 50, paddingBottom: 34 },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 1, ...typography.medium, marginBottom: 6 }, title: { color: colors.text, fontSize: 27, ...typography.semiBold },
  photoButton: { alignSelf: 'center', height: 104, width: 104, borderRadius: 52, marginTop: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', overflow: 'visible' }, photo: { width: 104, height: 104, borderRadius: 52 }, avatar: { color: colors.text, fontSize: 34, ...typography.semiBold },
  camera: { position: 'absolute', right: -2, bottom: -2, height: 31, width: 31, borderRadius: 16, backgroundColor: colors.accent, borderColor: colors.background, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }, cameraText: { color: colors.background, fontSize: 20, lineHeight: 22, ...typography.bold }, photoHint: { color: colors.primary, fontSize: 12, textAlign: 'center', marginTop: 12, ...typography.medium }, form: { marginTop: 30 },
});
