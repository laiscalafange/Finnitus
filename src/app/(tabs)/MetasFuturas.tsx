import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderInterno } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { styles } from "@/styles/metasfuturas";

export default function MetasFuturas() {
  return (
    <LinearGradient
      // Gradiente próprio dessa tela (não usa mais o GRADIENTS.background
      // compartilhado, pra não afetar outras telas como Premium)
      colors={["#3f1e69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

      {/* Cabeçalho fixo do topo (título "Metas" + subtítulo "Criação") */}
      <HeaderInterno
        titulo="Metas"
        subtitulo="Criação"
      />

      {/* Conteúdo principal, posicionado por cima do header
          (marginTop negativo no style "conteudoSobreHeader") */}
      <View style={styles.conteudoSobreHeader}>

        {/* Título da seção */}
        <Text style={styles.titulo}>
          Sonhos futuros
        </Text>

        {/* Campo de salário — usado pra calcular o quanto sobra pra metas */}
        <Input
          label="Salário"
          placeholder="Qual sua renda mensal?"
          keyboardType="numeric"
          icone={
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={styles.iconeInput}
            />
          }
        />

        {/* Campo de despesas — usado junto com o salário pra calcular a sobra mensal */}
        <Input
          label="Despesas"
          placeholder="Seus gastos mensais"
          keyboardType="numeric"
          icone={
            <Image
              source={require("../../../assets/icones/cifraoproibido.png")}
              style={styles.iconeInputs}
            />
          }
        />

        {/* Botão de confirmação, fixado mais pro final da tela via marginTop */}
        {/* TODO: implementar onPress — validar os campos e avançar pra próxima etapa
            (provavelmente salvar salário/despesas e ir pra próxima tela de metas) */}
        <View style={styles.botaoContainer}>
          <Button
            titulo="Confirmar"
            onPress={() => { }}
          />
        </View>

      </View>
    </LinearGradient>
  );
}