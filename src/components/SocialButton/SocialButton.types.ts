export interface SocialButtonProps {
  provider: "google" | "apple";
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}
