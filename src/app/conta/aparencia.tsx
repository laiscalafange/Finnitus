import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  Sun,
  Moon,
  Type,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { SelectCard } from "../../shared/components/SelectCard";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/aparencia";

const TEMAS = ["Claro", "Escuro"] as const;
const TAMANHOS_TEXTO = ["Pequeno", "Médio", "Grande"] as const;

// Tela "Aparência" (dentro de Configurações).
// TODO (backend): nada aqui muda o app de verdade ainda — é tudo
// estado local, só pra representar o layout do protótipo.
export default function Aparencia() {
  const [tema, setTema] = useState<(typeof TEMAS)[number]>("Escuro");
  const [tamanhoTexto, setTamanhoTexto] =
    useState<(typeof TAMANHOS_TEXTO)[number]>("Médio");

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno
          titulo="Aparência"
          subtitulo="Configurações"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            <View style={styles.linhaIcone}>
              {tema === "Claro" ? (
                <Sun size={18} color={Cores.roxo.claro} />
              ) : (
                <Moon size={18} color={Cores.roxo.claro} />
              )}
              <Text style={styles.rotuloItem}>Tema</Text>
            </View>

            {TEMAS.map((opcao) => (
              <SelectCard
                key={opcao}
                label={opcao}
                icon={null}
                selected={tema === opcao}
                onPress={() => setTema(opcao)}
              />
            ))}

            <View style={[styles.linhaIcone, styles.espacoTopo]}>
              <Type size={18} color={Cores.roxo.claro} />
              <Text style={styles.rotuloItem}>Tamanho dos textos</Text>
            </View>

            {TAMANHOS_TEXTO.map((opcao) => (
              <SelectCard
                key={opcao}
                label={opcao}
                icon={null}
                selected={tamanhoTexto === opcao}
                onPress={() => setTamanhoTexto(opcao)}
              />
            ))}
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}