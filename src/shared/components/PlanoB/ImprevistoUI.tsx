import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  Briefcase,
  Car,
  Check,
  FileText,
  GraduationCap,
  HeartPulse,
  House,
  Package,
  PawPrint,
  Plane,
  Smartphone,
  Tag,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react-native";

import { Text } from "@/shared/components/Texto";
import { Card } from "../Cards";
import { Input } from "../Input";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

import { SeletorCategoria } from "@/features/menuMais/components/SeletorCategoria";
import type { TextosCategoria } from "@/features/menuMais/components/ModalOutrasCategorias";
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
  carregarTiposCriados,
  salvarTipoCriado,
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
// CARD TRANSLÚCIDO E BOTÃO COMPACTO
// ---------------------------------------------------------------------

const GRADIENTE_VIDRO: [string, string] = [
  "rgba(126, 59, 237, 0.20)",
  "rgba(37, 7, 79, 0.10)",
];

// Card com fundo translúcido (deixa o fundo da tela aparecer)
export function CardVidro({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card gradiente={GRADIENTE_VIDRO} style={[estilos.vidro, style]}>
      {children}
    </Card>
  );
}

const VARIANTES_BOTAO = {
  primario: {
    cor: "#FFFFFF",
    fundo: "rgba(126, 59, 237, 0.85)",
    borda: "rgba(168, 130, 255, 0.6)",
  },
  secundario: {
    cor: Cores.texto.principal,
    fundo: "transparent",
    borda: "rgba(168, 130, 255, 0.45)",
  },
  perigo: {
    cor: "#FF8A8A",
    fundo: "transparent",
    borda: "rgba(239, 68, 68, 0.5)",
  },
} as const;

type BotaoPlanoProps = {
  titulo: string;
  variante?: keyof typeof VARIANTES_BOTAO;
  icone?: LucideIcon;
  disabled?: boolean;
  onPress?: () => void;
};

// Botão compacto das telas do Plano-B: texto menor e discreto, que nunca
// passa da largura do botão (o Button padrão tem fonte fixa de 18px)
export function BotaoPlano({
  titulo,
  variante = "primario",
  icone: Icone,
  disabled = false,
  onPress,
}: BotaoPlanoProps) {
  const { cor, fundo, borda } = VARIANTES_BOTAO[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: fundo, borderColor: borda },
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
      ]}
    >
      {Icone ? <Icone size={16} color={cor} /> : null}

      <Text
        style={[estilos.botaoTexto, { color: cor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------
// FORMULÁRIO
// ---------------------------------------------------------------------

// Campos do formulário como texto (é o que a pessoa digita)
export type CamposImprevisto = {
  nome: string;
  // id escolhido no seletor: um dos 3 tipos fixos, ou um tipo do modal
  // "Outros" (extra ou criado pela pessoa)
  tipo: string | null;
  // Nome do tipo escolhido (usado quando ele vem do modal "Outros")
  tipoRotulo: string;
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
    tipoRotulo: "",
    valor: "",
    data: hojeFormatado(),
    duracao: "",
    descricao: "",
  };
}

export function camposDoImprevisto(imprevisto: Imprevisto): CamposImprevisto {
  return {
    nome: imprevisto.nome,
    // Sem detalhe, um "OUTRO" volta marcado como "Outro" dentro do modal
    tipo:
      imprevisto.tipoDetalhe?.id ??
      (imprevisto.tipo === "OUTRO" ? ID_OUTRO_GERAL : imprevisto.tipo),
    tipoRotulo: imprevisto.tipoDetalhe?.rotulo ?? "",
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
    tipo: tipoApiDe(campos.tipo),
    tipoDetalhe:
      campos.tipo && tipoApiDe(campos.tipo) === "OUTRO" &&
      campos.tipo !== ID_OUTRO_GERAL
        ? { id: campos.tipo, rotulo: campos.tipoRotulo }
        : undefined,
    valor: moedaParaNumero(campos.valor),
    data: campos.data,
    duracaoMeses: campos.duracao ? Number(campos.duracao) : undefined,
    descricao: campos.descricao.trim(),
  };
}

// Os 3 primeiros tipos existem no backend. Todo o resto (os tipos do modal
// "Outros" e os criados pela pessoa) vai como "OUTRO".
const TIPOS_FIXOS: TipoImprevisto[] = [
  "PERDA_RENDA",
  "AUMENTO_DESPESA",
  "DESPESA_INESPERADA",
];

const ID_OUTRO_GERAL = "outro-geral";

function tipoApiDe(id: string | null): TipoImprevisto {
  return TIPOS_FIXOS.includes(id as TipoImprevisto)
    ? (id as TipoImprevisto)
    : "OUTRO";
}

// Mais tipos, que aparecem no modal do card "Outros"
const EXTRAS_TIPO: CategoriaItem[] = [
  { id: "outro-saude", rotulo: "Saúde", icone: HeartPulse },
  { id: "outro-veiculo", rotulo: "Veículo", icone: Car },
  { id: "outro-moradia", rotulo: "Moradia", icone: House },
  { id: "outro-eletronico", rotulo: "Eletrônicos", icone: Smartphone },
  { id: "outro-educacao", rotulo: "Educação", icone: GraduationCap },
  { id: "outro-viagem", rotulo: "Viagem", icone: Plane },
  { id: "outro-familia", rotulo: "Família", icone: Users },
  { id: "outro-trabalho", rotulo: "Trabalho", icone: Briefcase },
  { id: "outro-documentos", rotulo: "Multas e documentos", icone: FileText },
  { id: "outro-pet", rotulo: "Pet", icone: PawPrint },
  { id: ID_OUTRO_GERAL, rotulo: "Outro", icone: Tag },
];

// Grade do seletor de tipo (mesmo padrão das categorias de gasto)
const TIPOS: CategoriaItem[] = [
  { id: "PERDA_RENDA", rotulo: "Menos renda", icone: TrendingDown },
  { id: "AUMENTO_DESPESA", rotulo: "Mais gastos", icone: TrendingUp },
  { id: "DESPESA_INESPERADA", rotulo: "Inesperada", icone: TriangleAlert },
  { id: "outros", rotulo: "Outros", icone: Package, extras: EXTRAS_TIPO },
];

// Textos do modal "Outros" para tipos de imprevisto
const TEXTOS_TIPO: TextosCategoria = {
  titulo: "Outros tipos",
  criar: "+ Criar tipo de imprevisto",
  rotuloCampo: "Novo tipo de imprevisto",
  placeholder: "Ex: Problema com o pet",
  botaoCriar: "Criar tipo",
  semNome: "Digite o nome do tipo.",
  jaExiste: "Esse tipo já existe.",
  falhou: "Não foi possível criar o tipo.",
};

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

  // Tipos criados pela pessoa (ficam guardados no aparelho)
  const [criados, setCriados] = useState<CategoriaItem[]>([]);

  useEffect(() => {
    let ativo = true;

    void carregarTiposCriados().then((lista) => {
      if (ativo) {
        setCriados(
          lista.map((tipo) => ({ id: tipo.id, rotulo: tipo.rotulo, icone: Tag })),
        );
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  function guardarTipoCriado(nova: CategoriaItem) {
    setCriados((atual) => [...atual, nova]);
    void salvarTipoCriado({ id: nova.id, rotulo: nova.rotulo });
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
        aoSelecionar={(id, item) => alterar({ tipo: id, tipoRotulo: item.rotulo })}
        textos={TEXTOS_TIPO}
        criadas={criados}
        aoCriar={guardarTipoCriado}
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
  vidro: {
    borderColor: "rgba(190, 160, 255, 0.22)",
  },

  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },

  botaoTexto: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
  },

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
    borderColor: "rgba(168, 130, 255, 0.45)",
    borderRadius: 16,
    backgroundColor: "rgba(13, 17, 18, 0.45)",
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
    borderWidth: 1,
    borderColor: "rgba(168, 130, 255, 0.5)",
    borderRadius: 12,
  },

  acaoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.principal,
  },

  analiseTexto: {
    marginBottom: 10,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Cores.base.branco,
  },
});