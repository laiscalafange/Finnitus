import { Children, Fragment, type ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { ChevronRight, type LucideIcon } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './styles'

// ─────────────────────────────────────────────────────────────
// Peças usadas pelos blocos da Home (Eventos, Metas, Despesas fixas, Atenção):
// título + "Ver todos", lista de linhas e botão arredondado.
// ─────────────────────────────────────────────────────────────

type CardSecaoProps = {
  titulo: string
  // Quando existe, aparece o botão "Ver todos" no canto do título
  aoVerTodos?: () => void
  textoVerTodos?: string
  children: ReactNode
}

// Bloco com título verde (e "Ver todos ›") acima do conteúdo
export function CardSecao({
  titulo,
  aoVerTodos,
  textoVerTodos = 'Ver todos',
  children,
}: CardSecaoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
        </Text>

        {aoVerTodos && (
          <TouchableOpacity
            style={styles.verTodos}
            onPress={aoVerTodos}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${textoVerTodos}: ${titulo}`}
          >
            <Text style={styles.verTodosTexto}>{textoVerTodos}</Text>
            <ChevronRight size={18} color={Cores.roxo.claro} />
          </TouchableOpacity>
        )}
      </View>

      {children}
    </View>
  )
}

// Card roxo que agrupa linhas, com um divisor entre elas
export function ListaItens({ children }: { children: ReactNode }) {
  const itens = Children.toArray(children)

  return (
    <View style={styles.lista}>
      {itens.map((item, indice) => (
        <Fragment key={indice}>
          {indice > 0 && <View style={styles.divisor} />}
          {item}
        </Fragment>
      ))}
    </View>
  )
}

type LinhaItemProps = {
  icone: LucideIcon
  titulo: string
  subtitulo?: string
  aoPress?: () => void
  // Faixa verde no começo da linha
  destaque?: boolean
}

// Linha clicável: ícone, título, subtítulo e seta
export function LinhaItem({ icone: Icone, titulo, subtitulo, aoPress, destaque }: LinhaItemProps) {
  return (
    <TouchableOpacity
      style={[styles.linha, destaque && styles.linhaDestaque]}
      onPress={aoPress}
      disabled={!aoPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <View style={styles.bolhaLinha}>
        <Icone size={22} color={Cores.texto.principal} />
      </View>

      <View style={styles.textos}>
        <Text style={styles.linhaTitulo} numberOfLines={1}>
          {titulo}
        </Text>
        {!!subtitulo && (
          <Text style={styles.linhaSubtitulo} numberOfLines={2}>
            {subtitulo}
          </Text>
        )}
      </View>

      {aoPress && <ChevronRight size={20} color={Cores.roxo.claro} />}
    </TouchableOpacity>
  )
}

// Botão arredondado com seta ("Ver evento ›", "Ver meta ›")
export function BotaoPilula({ titulo, aoPress }: { titulo: string; aoPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.pilula}
      onPress={aoPress}
      disabled={!aoPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <Text style={styles.pilulaTexto}>{titulo}</Text>
      <ChevronRight size={16} color={Cores.base.branco} />
    </TouchableOpacity>
  )
}