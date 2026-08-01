import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native'; // ou @expo/vector-icons se preferir
import { styles } from './SelectCardStyles';
import { SelectCardProps } from './SelectCardTypes';

export function SelectCard({ label, icon, selected, onPress }: SelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <View style={styles.left}>
        {icon}
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
      </View>

      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Check size={14} color="#0D0D0D" strokeWidth={3} />}
      </View>
    </Pressable>
  );
}