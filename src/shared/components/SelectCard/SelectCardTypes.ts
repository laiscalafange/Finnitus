import { ReactNode } from 'react';

export interface SelectCardProps {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onPress: () => void;
}