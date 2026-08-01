import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SelectCard } from '../../shared/components/SelectCard';
import { Wand2, Plane, Car, Home, CreditCard, Wrench, Plus } from 'lucide-react-native';

const OPTIONS = [
  { id: 'emergencia', label: 'Fundo de emergência', icon: Wand2 },
  { id: 'viagem', label: 'Viagem', icon: Plane },
  { id: 'carro', label: 'Carro novo', icon: Car },
  { id: 'casa', label: 'Casa nova', icon: Home },
  { id: 'divida', label: 'Pagar dívida', icon: CreditCard },
  { id: 'reforma', label: 'Reforma', icon: Wrench },
  { id: 'personalizado', label: 'Objetivo personalizado', icon: Plus },
];

export default function MetasFuturas() {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  function toggle(id: string) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  return (
    <ScrollView>
      {OPTIONS.map(({ id, label, icon: Icon }) => (
        <SelectCard
          key={id}
          label={label}
          icon={<Icon size={20} color={selecionados.includes(id) ? '#A3E635' : '#7C3AED'} />}
          selected={selecionados.includes(id)}
          onPress={() => toggle(id)}
        />
      ))}
    </ScrollView>
  );
}