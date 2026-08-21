import { ReactNode } from 'react';

export interface SelectCardProps {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  showCheckbox?: boolean;
  onPress: () => void;
}