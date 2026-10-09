import { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Action = { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' };
type Dialog = { title: string; message: string; actions: Action[] } | null;
type DialogContextValue = { show: (title: string, message: string, actions?: Action[]) => void };
const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const show = useCallback((title: string, message: string, actions: Action[] = [{ text: 'OK' }]) => setDialog({ title, message, actions }), []);
  const press = (action: Action) => { setDialog(null); action.onPress?.(); };
  return <DialogContext.Provider value={{ show }}>{children}
    <Modal transparent visible={dialog !== null} animationType="fade" onRequestClose={() => setDialog(null)}><View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 }}><View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20 }}><Text style={{ color: colors.text, fontSize: 18, ...typography.semiBold }}>{dialog?.title}</Text><Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 9, ...typography.regular }}>{dialog?.message}</Text><View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>{dialog?.actions.map((action, index) => <Pressable key={`${action.text}-${index}`} style={{ flex: 1, minHeight: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: action.style === 'cancel' ? 1 : 0, borderColor: colors.border, backgroundColor: action.style === 'destructive' ? colors.danger : action.style === 'cancel' ? colors.surfaceRaised : colors.primary }} onPress={() => press(action)}><Text style={{ color: colors.text, fontSize: 14, ...typography.semiBold }}>{action.text}</Text></Pressable>)}</View></View></View></Modal>
  </DialogContext.Provider>;
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog debe utilizarse dentro de DialogProvider');
  return context;
}
