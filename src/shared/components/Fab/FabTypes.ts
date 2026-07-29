import { ReactNode } from "react";

export interface FABProps {
  icon: ReactNode;
  onPress: () => void;
  bottom?: number;
  right?: number;
}