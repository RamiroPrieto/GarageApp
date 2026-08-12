import { PressableProps } from "react-native";

export interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
}