import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
} from "react-native";

import {
  Redirect,
  useRouter,
} from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { FourInput } from "../../shared/components/Four";
import { Button } from "../../shared/components/Button";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";

import { styles } from "../../styles/trocarSenhaCodigo";

// 2ª etapa de "Trocar senha": código de 4 dígitos enviado pro e-mail
// confirmado na etapa anterior. Mesmo componente FourInput usado no
// fluxo "Esqueci minha senha".
export default function TrocarSenhaCodigo() {
  const router = useRouter();

  const { recoveryEmail, setResetToken } = useAuth();

  const [codigo, setCodigo] = useState("");
  const [remaining, setRemaining] = useState(60);
  const [attempt, setAttempt] = useState(0);

  const { busy, error, run, setError } = useAction();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sem e-mail confirmado, essa tela não faz sentido sozinha
  if (!recoveryEmail) {
    return <Redirect href="/conta/trocarSenhaEmail" />;
  }

  function validar() {
    void run(async () => {
      if (!/^\d{4}$/.test(codigo)) {
        throw new Error("Informe os quatro dígitos.");
      }

      const result = await authService.verify(recoveryEmail, codigo);

      setResetToken(result.resetToken);

      router.replace("/conta/redefinirSenha");
    });
  }

  function reenviar() {
    void run(async () => {
      await authService.forgot(recoveryEmail);

      setRemaining(60);
      setCodigo("");
      setAttempt((value) => value + 1);
    });
  }

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
          titulo="Trocar senha"
          subtitulo="Segurança"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.formulario}>
          <Text style={styles.texto}>
            {`Confira o e-mail ${recoveryEmail}. O código expira em 15 minutos.`}
          </Text>

          <FourInput
            key={attempt}
            erro={Boolean(error)}
            onCodigoCompleto={(value) => {
              setCodigo(value);
              setError("");
            }}
          />

          {error ? (
            <Text style={styles.erro} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          <View style={styles.espacoBotoes}>
            <Button
              titulo={busy ? "Aguarde..." : "Validar código"}
              variante="terciario"
              disabled={busy || codigo.length !== 4}
              onPress={validar}
            />

            <Button
              titulo={
                remaining > 0
                  ? `Reenviar em ${remaining}s`
                  : "Reenviar código"
              }
              variante="outline"
              disabled={busy || remaining > 0}
              onPress={reenviar}
            />

            <Text style={styles.aviso}>
              A API permite até cinco tentativas por código. Um novo
              pedido invalida o código anterior.
            </Text>

            <Button
              titulo="Usar outro e-mail"
              variante="outline"
              disabled={busy}
              onPress={() => router.replace("/conta/trocarSenhaEmail")}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}