import { Cores } from '@/shared/constants/Cores';
import { useFocusEffect } from "expo-router";
import { ChevronDown } from 'lucide-react-native';
import { useCallback, useState } from "react";
import { Image, TouchableOpacity, View } from 'react-native';
import { SinoNotificacoes } from '@/shared/components/SinoNotificacoes';
import { Text } from '@/shared/components/Texto';
import { useIdioma } from '@/features/idioma';
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
  onPerfil?: () => void
}

// Topo da Home: avatar, mês no centro e coroa + sino (igual às outras telas)
export function DashboardHeader({ nome, mes, aoPressMes, onPremium, onPerfil }: Props) {
  const { user } = useAuth();
  const { t } = useIdioma();

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
    accessibilityLabel={t("Abrir perfil")}
  >
    <Avatar
      name={user?.name ?? nome ?? t("Usuário")}
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
        accessibilityLabel={t("Mês selecionado: {mes}. Toque para trocar", { mes })}
      >
        <Text style={styles.mesTexto} numberOfLines={1}>{mes}</Text>
        <ChevronDown size={22} color={Cores.base.branco} />
      </TouchableOpacity>

      <View style={styles.icones}>
        {/* Coroa — leva pra tela Premium */}
        <TouchableOpacity onPress={onPremium} activeOpacity={0.75} accessibilityLabel={t("Abrir Premium")}>
          <Image source={require('../../../../assets/icones/coroa.png')} style={styles.icone} />
        </TouchableOpacity>

        <SinoNotificacoes estiloIcone={styles.icone} />
      </View>
    </View>
  )
}
