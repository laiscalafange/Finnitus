import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";
import {
  Landmark,
  PiggyBank,
  Wallet,
  CreditCard,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { SelectCard } from "../../shared/components/SelectCard";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/dadosBancarios";

// Opções do "Tipo de conta" (a pessoa escolhe em vez de digitar)
const TIPOS_CONTA = [
  { id: "corrente", label: "Corrente", icon: Landmark },
  { id: "poupanca", label: "Poupança", icon: PiggyBank },
  { id: "salario", label: "Salário", icon: Wallet },
  { id: "pagamento", label: "Pagamento", icon: CreditCard },
] as const;

type TipoConta = (typeof TIPOS_CONTA)[number]["id"];

// Tela "Editar dados bancários".
export default function DadosBancarios() {
  const router = useRouter();

  // Campos do formulário
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [chavePix, setChavePix] = useState("");

  // Tipo de conta escolhido (null = ainda não escolheu)
  const [tipo, setTipo] = useState<TipoConta | null>(null);

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  function salvar() {
    // Banco, agência e conta são obrigatórios (a chave Pix é opcional)
    if (
      !banco.trim() ||
      !agencia.trim() ||
      !conta.trim()
    ) {
      setErro("Preencha banco, agência e conta.");
      return;
    }

    if (!tipo) {
      setErro("Escolha o tipo da conta.");
      return;
    }

    setErro("");

    // TODO (backend): enviar { banco, agencia, conta, tipo, chavePix } pra API.
    // Hoje ainda não existe tabela/rota de dados bancários, então por enquanto
    // a tela só valida e volta pro Perfil.

    router.dismissTo("/perfil");
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      {/* Empurra o formulário pra cima quando o teclado abre */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
          <HeaderInterno titulo="Dados bancários" />

          {/* Formulário (logo abaixo do cabeçalho) */}
          <View style={styles.formulario}>
            <Input
              label="Banco"
              placeholder="Ex.: Nubank"
              value={banco}
              onChangeText={setBanco}
              autoCapitalize="words"
            />

            <Input
              label="Agência"
              placeholder="0001"
              value={agencia}
              onChangeText={setAgencia}
              keyboardType="numeric"
            />

            <Input
              label="Conta"
              placeholder="123456-7"
              value={conta}
              onChangeText={setConta}
            />

            {/* Tipo de conta: escolha entre as opções (SelectCard),
                sem digitar. A opção marcada fica verde-limão */}
            <Text style={styles.rotuloTipo}>
              Tipo de conta
            </Text>

            {TIPOS_CONTA.map(({ id, label, icon: Icone }) => (
              <SelectCard
                key={id}
                label={label}
                icon={
                  <Icone
                    size={22}
                    color={
                      tipo === id
                        ? Cores.destaque.limao
                        : Cores.roxo.claro
                    }
                  />
                }
                selected={tipo === id}
                onPress={() => setTipo(id)}
              />
            ))}

            <Input
              label="Chave Pix"
              placeholder="E-mail, telefone, CPF ou chave aleatória"
              value={chavePix}
              onChangeText={setChavePix}
            />

            {/* Mensagem de erro de validação */}
            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            <Button
              titulo="Salvar alterações"
              onPress={salvar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}