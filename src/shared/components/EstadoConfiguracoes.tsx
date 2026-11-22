import { useIdioma } from "@/features/idioma";
import { useConfiguracoes } from "@/features/configuracoesContext";
import { Button } from "./Button";
import { Text } from "./Texto";

export function EstadoConfiguracoes() {
  const { t } = useIdioma();
  const { configuracoes, carregando, erro, carregar } = useConfiguracoes();
  if (carregando && !configuracoes) {
    return <Text style={{ color: "#D9C5F5" }}>{t("Carregando configurações...")}</Text>;
  }
  if (!erro) return null;

  return (
    <>
      <Text style={{ color: "#FF8585" }} accessibilityRole="alert">{erro}</Text>
      {!configuracoes && (
        <Button titulo={t("Tentar novamente")} variante="outline" onPress={() => void carregar()} />
      )}
    </>
  );
}
