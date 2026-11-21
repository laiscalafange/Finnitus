import { TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { Text } from '@/shared/components/Texto'
import { useConfiguracoes, useMoedaExibicao, useMoedaVisivel } from '@/features/configuracoesContext'
import { useIdioma } from '@/features/idioma'
import { MEDIDAS, styles } from './styles'

type Props = {
  receitas?: number
  despesas?: number
  // Tocar em Receitas ou Despesas abre a tela Movimentações
  onPressReceitas?: () => void
  onPressDespesas?: () => void
}

// ─── Tamanho da fonte do valor ────────────────────────────────────────────
// Não usamos adjustsFontSizeToFit aqui: no Android ele encolhia o valor ao
// mínimo. O tamanho é calculado pela largura real do texto na fonte do app
// (Raleway ExtraBold, medida em "em"): sempre cabe e continua legível.

// Largura de cada caractere em "em" (dígitos: 0.62, o maior deles)
const LARGURA_EM: Record<string, number> = {
  R: 0.67, $: 0.64, ' ': 0.24, '.': 0.25, ',': 0.25, '-': 0.42, '•': 0.37,
  m: 0.94, i: 0.27, b: 0.64, t: 0.4, r: 0.4, l: 0.34,
}

const larguraEm = (texto: string) =>
  [...texto].reduce((soma, caractere) => soma + (LARGURA_EM[caractere] ?? 0.62), 0)

const FONTE_MAXIMA = 17
const FONTE_MINIMA = 11
const FOLGA = 1.06 // 6% de segurança

// "fator" é o da configuração de tamanho do texto (o componente Text já
// multiplica o fontSize por ele), então dividimos aqui pra compensar.
function tamanhoFonteValor(texto: string, larguraDisponivel: number, fator: number) {
  const ideal = larguraDisponivel / (larguraEm(texto) * FOLGA * fator)
  return Math.max(FONTE_MINIMA, Math.min(FONTE_MAXIMA, Math.floor(ideal)))
}

type ValorProps = {
  texto: string
  corEstilo: object
  larguraDisponivel: number
  fator: number
}

function Valor({ texto, corEstilo, larguraDisponivel, fator }: ValorProps) {
  return (
    <Text
      style={[styles.valor, corEstilo, { fontSize: tamanhoFonteValor(texto, larguraDisponivel, fator) }]}
      numberOfLines={1}
      allowFontScaling={false}
    >
      {texto}
    </Text>
  )
}

// Receitas e Despesas lado a lado (ficam dentro do header roxo da Home)
export function CardResumo({ receitas, despesas, onPressReceitas, onPressDespesas }: Props) {
  const moedaVisivel = useMoedaVisivel()
  const moedaCompacta = useMoedaVisivel(true)
  const { taxa } = useMoedaExibicao()
  const { t } = useIdioma()
  const { configuracoes } = useConfiguracoes()
  const { width } = useWindowDimensions()

  const fator = configuracoes?.tamanhoTexto === 'PEQUENO' ? 0.9
    : configuracoes?.tamanhoTexto === 'GRANDE' ? 1.15
    : 1

  // Largura que sobra pro valor: metade da linha menos o ícone, o espaço
  // entre ele e o texto e o padding lateral (as medidas vêm do styles.ts)
  const metade = (width - MEDIDAS.linhaPadding * 2 - MEDIDAS.linhaGap) / 2
  const larguraDisponivel = metade - MEDIDAS.itemPadding * 2 - MEDIDAS.bolha - MEDIDAS.itemGap

  // Abrevia valores a partir de um milhão na moeda de exibição.
  const moedaResumo = (valor = 0) => Math.abs(valor * taxa) >= 1_000_000
    ? moedaCompacta(valor)
    : moedaVisivel(valor)

  return (
    <View style={styles.linha}>
      <TouchableOpacity
        style={styles.item}
        onPress={onPressReceitas}
        disabled={!onPressReceitas}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={t('Ver movimentações de receitas')}
      >
        <View style={[styles.bolha, styles.bolhaReceita]}>
          <ArrowUp size={26} color={Cores.texto.contraste} />
        </View>
        <View style={styles.textos}>
          <View style={styles.rotuloLinha}>
            <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>{t('Receitas')}</Text>
            {onPressReceitas && <ChevronRight size={16} color={Cores.texto.claro} />}
          </View>
          <Valor
            texto={moedaResumo(receitas)}
            corEstilo={styles.valorReceita}
            larguraDisponivel={larguraDisponivel}
            fator={fator}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onPressDespesas}
        disabled={!onPressDespesas}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={t('Ver movimentações de despesas')}
      >
        <View style={[styles.bolha, styles.bolhaDespesa]}>
          <ArrowDown size={26} color={Cores.base.branco} />
        </View>
        <View style={styles.textos}>
          <View style={styles.rotuloLinha}>
            <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>{t('Despesas')}</Text>
            {onPressDespesas && <ChevronRight size={16} color={Cores.texto.claro} />}
          </View>
          <Valor
            texto={moedaResumo(despesas)}
            corEstilo={styles.valorDespesa}
            larguraDisponivel={larguraDisponivel}
            fator={fator}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}
