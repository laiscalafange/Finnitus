import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Check,
  Tag,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react-native";

import { Input } from "../Input";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

import { SeletorCategoria } from "@/features/menuMais/components/SeletorCategoria";
import type { CategoriaItem } from "@/features/menuMais/types";
import { styles as base } from "@/features/menuMais/styles/formulario";
import {
  dataValida,
  formatarCentavos,
  hojeFormatado,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import {
  ROTULOS_STATUS,
  ROTULOS_TIPO,
  type DadosImprevisto,
  type Estrategia,
  type Imprevisto,
  type StatusImprevisto,
  type TipoImprevisto,
} from "@/services/imprevistosApi";

// =====================================================================
// Componentes usados pela tela Plano B e pela tela de detalhes do
// imprevisto (Detalhes/DetalheImprevisto.tsx).
// =====================================================================

// O banco guarda a descrição em VARCHAR(255)
export const LIMITE_DESCRICAO = 255;

// ---------------------------------------------------------------------
// FORMULÁRIO
// ---------------------------------------------------------------------

// Campos do formulário como texto (é o que a pessoa digita)
export type CamposImprevisto = {
  nome: string;
  tipo: TipoImprevisto | null;
  valor: string;
  // DD/MM/AAAA
  data: string;
  duracao: string;
  descricao: string;
};

export function camposVazios(): CamposImprevisto {
  return {
    nome: "",
    tipo: null,
    valor: "",
    data: hojeFormatado(),
    duracao: "",
    descricao: "",
  };
}

export function camposDoImprevisto(imprevisto: Imprevisto): CamposImprevisto {
  return {
    nome: imprevisto.nome,
    tipo: imprevisto.tipo,
    valor: formatarCentavos(Math.round(imprevisto.valor * 100)),
    data: imprevisto.data,
    duracao: imprevisto.duracaoMeses ? String(imprevisto.duracaoMeses) : "",
    descricao: imprevisto.descricao,
  };
}

// Devolve a mensagem do primeiro problema, ou null se está tudo certo
export function validarCampos(campos: CamposImprevisto): string | null {
  if (!campos.nome.trim()) {
    return "Informe o nome do imprevisto.";
  }

  if (!campos.tipo) {
    return "Escolha o tipo do imprevisto.";
  }

  if (moedaParaNumero(campos.valor) <= 0) {
    return "Informe o valor estimado.";
  }

  if (!dataValida(campos.data)) {
    return "Informe uma data válida (DD/MM/AAAA).";
  }

  if (campos.duracao) {
    const meses = Number(campos.duracao);

    if (!Number.isInteger(meses) || meses < 1 || meses > 60) {
      return "A duração do prejuízo deve ser de 1 a 60 meses.";
    }
  }

  if (campos.descricao.trim().length < 10) {
    return "Explique a situação com um pouco mais de detalhes.";
  }

  return null;
}

// Só chame depois de validarCampos devolver null
export function camposParaDados(campos: CamposImprevisto): DadosImprevisto {
  return {
    nome: campos.nome.trim(),
    tipo: campos.tipo as TipoImprevisto,
    valor: moedaParaNumero(campos.valor),
    data: campos.data,
    duracaoMeses: campos.duracao ? Number(campos.duracao) : undefined,
    descricao: campos.descricao.trim(),
  };
}

// Ícones do seletor de tipo (mesmos ícones lucide das categorias)
const TIPOS: CategoriaItem[] = [
  { id: "PERDA_RENDA", rotulo: ROTULOS_TIPO.PERDA_RENDA, icone: TrendingDown },
  { id: "AUMENTO_DESPESA", rotulo: "Mais despesa", icone: TrendingUp },
  { id: "DESPESA_INESPERADA", rotulo: "Inesperada", icone: TriangleAlert },
  { id: "OUTRO", rotulo: ROTULOS_TIPO.OUTRO, icone: Tag },
];

type FormularioProps = {
  campos: CamposImprevisto;
  aoAlterar: (campos: CamposImprevisto) => void;
  erro?: string;
  // Bloqueia a digitação enquanto a IA analisa ou o app salva
  desabilitado?: boolean;
};

// Campos de "Registrar imprevisto" e de "Editar imprevisto". Os botões ficam
// por conta de quem usa (enviar para análise, salvar alterações...).
export function FormularioImprevisto({
  campos,
  aoAlterar,
  erro,
  desabilitado = false,
}: FormularioProps) {
  function alterar(parcial: Partial<CamposImprevisto>) {
    aoAlterar({ ...campos, ...parcial });
  }

  return (
    <View>
      <Input
        label="Nome do imprevisto"
        placeholder="Ex: Conserto do carro"
        value={campos.nome}
        onChangeText={(nome) => alterar({ nome })}
        autoCapitalize="sentences"
        maxLength={60}
        editable={!desabilitado}
      />

      <SeletorCategoria
        rotulo="Tipo do imprevisto"
        categorias={TIPOS}
        selecionada={campos.tipo}
        aoSelecionar={(id) => alterar({ tipo: id as TipoImprevisto })}
      />

      <Input
        label="Valor estimado"
        placeholder="0,00"
        keyboardType="numeric"
        value={campos.valor}
        onChangeText={(texto) => alterar({ valor: mascararMoeda(texto) })}
        icone={<Text style={base.prefixoMoeda}>R$</Text>}
        editable={!desabilitado}
      />

      <Input
        label="Data do evento"
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        maxLength={10}
        value={campos.data}
        onChangeText={(texto) => alterar({ data: mascararData(texto) })}
        editable={!desabilitado}
      />

      <Input
        label="Duração do prejuízo em meses (opcional)"
        placeholder="Ex: 3"
        keyboardType="numeric"
        maxLength={2}
        value={campos.duracao}
        onChangeText={(texto) =>
          alterar({ duracao: texto.replace(/\D/g, "") })
        }
        editable={!desabilitado}
      />

      <Input
        label="Explique a situação"
        placeholder="Conte o que aconteceu, o que já foi feito e o que você precisa resolver."
        value={campos.descricao}
        onChangeText={(descricao) => alterar({ descricao })}
        autoCapitalize="sentences"
        autoCorrect
        multiline
        numberOfLines={5}
        maxLength={LIMITE_DESCRICAO}
        editable={!desabilitado}
      />

      <Text style={estilos.contador}>
        {campos.descricao.length}/{LIMITE_DESCRICAO}
      </Text>

      {erro ? (
        <Text style={base.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------
// STATUS
// ---------------------------------------------------------------------

export const COR_STATUS: Record<StatusImprevisto, string> = {
  pendente: Cores.estado.alerta,
  andamento: Cores.roxo.claro,
  resolvido: Cores.estado.sucesso,
};

export function StatusBadge({ status }: { status: StatusImprevisto }) {
  const cor = COR_STATUS[status];

  return (
    <View style={[estilos.badge, { borderColor: cor }]}>
      <View style={[estilos.badgePonto, { backgroundColor: cor }]} />
      <Text style={[estilos.badgeTexto, { color: cor }]}>
        {ROTULOS_STATUS[status]}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------
// ESTRATÉGIA
// ---------------------------------------------------------------------

const COR_TOM = {
  positivo: Cores.destaque.limao,
  alerta: Cores.estado.perigo,
  neutro: Cores.base.branco,
} as const;

type EstrategiaCardProps = {
  estrategia: Estrategia;
  selecionada?: boolean;
  // Modo "escolher": o card inteiro é tocável (tela Plano B)
  aoSelecionar?: () => void;
  // Modo "ação": botão de texto no rodapé (tela de detalhes)
  acaoRotulo?: string;
  aoAcao?: () => void;
  desabilitado?: boolean;
};

export function EstrategiaCard({
  estrategia,
  selecionada = false,
  aoSelecionar,
  acaoRotulo,
  aoAcao,
  desabilitado = false,
}: EstrategiaCardProps) {
  const conteudo = (
    <>
      <View style={estilos.estrategiaTopo}>
        <Text style={estilos.estrategiaTitulo}>{estrategia.titulo}</Text>

        {aoSelecionar || selecionada ? (
          <View
            style={[
              estilos.marcador,
              selecionada && estilos.marcadorAtivo,
            ]}
          >
            {selecionada ? (
              <Check size={14} color={Cores.texto.contraste} />
            ) : null}
          </View>
        ) : null}
      </View>

      <Text style={estilos.estrategiaDescricao}>{estrategia.descricao}</Text>

      {estrategia.impactos.map((impacto) => (
        <View key={impacto.rotulo} style={estilos.impactoLinha}>
          <Text style={estilos.impactoRotulo}>{impacto.rotulo}</Text>

          <Text
            style={[
              estilos.impactoValor,
              { color: COR_TOM[impacto.tom ?? "neutro"] },
            ]}
          >
            {impacto.valor}
          </Text>
        </View>
      ))}

      {acaoRotulo && aoAcao ? (
        <Pressable
          accessibilityRole="button"
          disabled={desabilitado}
          onPress={aoAcao}
          style={({ pressed }) => [
            estilos.acao,
            (pressed || desabilitado) && { opacity: 0.6 },
          ]}
        >
          <Text style={estilos.acaoTexto}>{acaoRotulo}</Text>
        </Pressable>
      ) : null}
    </>
  );

  const estiloCard = [estilos.estrategia, selecionada && estilos.estrategiaAtiva];

  if (aoSelecionar) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: selecionada, disabled: desabilitado }}
        disabled={desabilitado}
        onPress={aoSelecionar}
        style={estiloCard}
      >
        {conteudo}
      </Pressable>
    );
  }

  return <View style={estiloCard}>{conteudo}</View>;
}

// ---------------------------------------------------------------------
// TEXTO DA IA
// ---------------------------------------------------------------------

// Mostra o texto da IA em parágrafos
export function TextoAnalise({ texto }: { texto: string }) {
  return (
    <View>
      {texto.split(/\n{2,}/).map((paragrafo, indice) => (
        <Text key={indice} style={estilos.analiseTexto}>
          {paragrafo.trim()}
        </Text>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  contador: {
    marginTop: -10,
    marginBottom: 12,
    textAlign: "right",
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 20,
  },

  badgePonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
  },

  estrategia: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 16,
    backgroundColor: Cores.fundo.principal,
  },

  estrategiaAtiva: {
    borderColor: Cores.destaque.limao,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
  },

  estrategiaTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },

  estrategiaTitulo: {
    flex: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  marcador: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    alignItems: "center",
    justifyContent: "center",
  },

  marcadorAtivo: {
    borderColor: Cores.destaque.limao,
    backgroundColor: Cores.destaque.limao,
  },

  estrategiaDescricao: {
    marginBottom: 10,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
  },

  impactoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: Cores.overlay.suave,
  },

  impactoRotulo: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  impactoValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
  },

  acao: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Cores.destaque.limao,
    borderRadius: 12,
  },

  acaoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
  },

  analiseTexto: {
    marginBottom: 10,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Cores.base.branco,
  },
});