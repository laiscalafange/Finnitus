import { Cores } from '@/shared/constants/Cores';
import { useFocusEffect } from "expo-router";
import { ChevronDown } from 'lucide-react-native';
import { useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './DashboardHeaderStyles';

import { api } from "../../../services/api";
import { Avatar } from "../../../shared/components/Avatar";
import { useAuth } from "../../authContext";
type Props = {
  // Nome da pessoa (só pra mostrar as iniciais no avatar)
  nome?: string
  // Mês mostrado no centro (ex.: "Outubro")
  mes: string
  aoPressMes?: () => void
  onPremium?: () => void
  onNotificacao?: () => void
  onPerfil?: () => void
}

// Topo da Home: avatar, mês no centro e coroa + sino (igual às outras telas)
export function DashboardHeader({ nome, mes, aoPressMes, onPremium, onNotificacao, onPerfil }: Props) {
  const { user } = useAuth();

const [fotoPerfil, setFotoPerfil] =
  useState<string | null>(null);

useFocusEffect(
  useCallback(() => {
    let ativo = true;

    if (!user) {
      setFotoPerfil(null);
      return () => {
        ativo = false;
      };
    }

    async function carregarFoto() {
      try {
        const resposta = await api.get("/me/foto");

        if (ativo) {
          setFotoPerfil(
            resposta.data.fotoPerfilUrl ?? null
          );
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar foto na Home:",
          erro
        );
      }
    }

    carregarFoto();

    return () => {
      ativo = false;
    };
  }, [user?.email])
);
  return (
    <View style={styles.container}>
      <View style={styles.avatarArea}>
  <TouchableOpacity
    onPress={onPerfil}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel="Abrir perfil"
  >
    <Avatar
      name={user?.name ?? nome ?? "Usuário"}
      image={fotoPerfil ?? undefined}
      size={50}
      semBorda
    />
  </TouchableOpacity>
</View>

      <TouchableOpacity
        style={styles.mes}
        onPress={aoPressMes}
        disabled={!aoPressMes}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Mês selecionado: ${mes}. Toque para trocar`}
      >
        <Text style={styles.mesTexto} numberOfLines={1}>{mes}</Text>
        <ChevronDown size={22} color={Cores.base.branco} />
      </TouchableOpacity>

      <View style={styles.icones}>
        {/* Coroa — leva pra tela Premium */}
        <TouchableOpacity onPress={onPremium} activeOpacity={0.75} accessibilityLabel="Abrir Premium">
          <Image source={require('../../../../assets/icones/coroa.png')} style={styles.icone} />
        </TouchableOpacity>

        {/* Sino — leva pra tela de Notificações */}
        <TouchableOpacity onPress={onNotificacao} activeOpacity={0.75} accessibilityLabel="Abrir notificações">
          <Image source={require('../../../../assets/icones/sino.png')} style={styles.icone} />
        </TouchableOpacity>
      </View>
    </View>
  )
}