import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingTop: 50, paddingBottom: 36 },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 1, ...typography.medium, marginBottom: 6 }, title: { color: colors.text, fontSize: 27, ...typography.semiBold, marginBottom: 24 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 15, padding: 18 }, heading: { color: colors.text, fontSize: 15, ...typography.semiBold, marginTop: 6, marginBottom: 7 }, text: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, ...typography.regular, marginBottom: 19 }, updated: { color: colors.textMuted, fontSize: 11, ...typography.regular, marginTop: 4 },
});
