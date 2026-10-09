import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: 34 },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 1.1, ...typography.medium, marginBottom: 5 },
  title: { color: colors.text, fontSize: 26, ...typography.semiBold },
  subtitle: { color: colors.textSecondary, fontSize: 13, ...typography.regular, marginTop: 7 },
  balance: { color: colors.accent, fontSize: 13, ...typography.medium, marginTop: 10, marginBottom: 27 },
  label: { color: colors.textSecondary, fontSize: 11, letterSpacing: 0.55, ...typography.medium, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 56, color: colors.text, fontSize: 14, ...typography.regular },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginTop: 17, marginBottom: 22 },
  cardLabel: { color: colors.textSecondary, fontSize: 11, letterSpacing: 0.55, ...typography.medium },
  price: { color: colors.text, fontSize: 24, ...typography.semiBold, marginTop: 5 },
  stateTitle: { color: colors.text, fontSize: 16, ...typography.semiBold },
  stateMessage: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, ...typography.regular, marginTop: 6 },
  secondaryAction: { marginTop: 10 },
});
