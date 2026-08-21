import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { styles } from './SelectCardStyles';
import { SelectCardProps } from './SelectCardTypes';

export function SelectCard({
  label,
  icon,
  selected,
  showCheckbox = true,
  onPress,
}: SelectCardProps) {
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

      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Check size={14} color="#0D0D0D" strokeWidth={3} />}
        </View>
      )}
    </Pressable>
  );
}