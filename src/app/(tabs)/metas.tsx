import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { CalendarioSemana } from '../../shared/components/CalendarioSemana'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { styles } from '../../styles/metas'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Cores } from '../../shared/constants/Cores'

import { METAS_DO_MES, METAS_LONGO_PRAZO } from '../../features/metasData'

export default function Metas() {
  // Hook de navegação do Expo Router
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Fundo gradiente compartilhado (componente próprio, diferente
          das outras telas que usam LinearGradient direto) */}
      <BackgroundGradient />

      <ScrollView style={styles.scroll}>

        {/* Cabeçalho com calendário da semana + ações de adicionar/editar meta */}
        <CalendarioSemana
          titulo="Metas"
          subtitulo="Financeiras"
          aoSelecionarDia={(data) => console.log(data)}
          mostrarAcoes
          // TODO: ajustar "/metas-futuras" pro nome real da rota de criação de meta
          aoPressAdicionar={() => router.push('/MetasFuturas')}
          // TODO: ajustar "/editar-metas" pro nome real da rota de edição de metas
          aoPressEditar={() => router.push('/')}
        />

        <View style={styles.conteudo}>

          {/* ── ANÁLISES / HISTÓRICO ── */}
          <View style={styles.navRow}>

            {/* ANÁLISES — leva pra tela de análises financeiras das metas
                TODO: ajustar "/analises" pro nome real da rota */}
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push('/')}
            >
              <LinearGradient
                colors={[Cores.fundo.destaque, '#5a2dc7']}
                style={styles.navCaixa}
              >
                <Image
                  source={require('../../../assets/icones/analise.png')}
                  style={styles.navIconeS}
                />
              </LinearGradient>

              <Text style={styles.navTextoEsquerda}>
                Análises
              </Text>
            </TouchableOpacity>

            {/* HISTÓRICO — leva pra tela com o histórico completo de movimentações
                TODO: ajustar "/historico-metas" pro nome real da rota */}
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push('/')}
            >
              <LinearGradient
                colors={[Cores.fundo.destaque, '#5a2dc7']}
                style={styles.navCaixa}
              >
                <Image
                  source={require('../../../assets/icones/historicoM.png')}
                  style={styles.navIconeH}
                />
              </LinearGradient>

              <Text style={styles.navTextoDireita}>
                Histórico
              </Text>
            </TouchableOpacity>

          </View>

          {/* ── METAS DO MÊS ── */}
          <Text style={styles.secaoTitulo}>
            Metas do mês
          </Text>

          <View style={styles.metasLista}>
            {METAS_DO_MES.map(meta => {
              // Calcula a porcentagem preenchida da barra de progresso,
              // limitada a 100% mesmo se valorAtual passar do valorTotal
              const pct = Math.min(
                100,
                (meta.valorAtual / meta.valorTotal) * 100
              )

              return (
                <View key={meta.id} style={styles.metaLinha}>
                  <View style={styles.metaPonto} />

                  {/* Card inteiro é clicável — leva pros detalhes daquela meta específica
                      TODO: ajustar "/metas-detalhes" pro nome real da rota, se for diferente */}
                  <TouchableOpacity
                    style={styles.metaCardWrapper}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/',
                        params: { id: meta.id },
                      })
                    }
                  >
                    <LinearGradient
                      colors={[Cores.fundo.destaque, '#330e6d']}
                      style={styles.metaCard}
                    >
                      <View style={styles.metaHeader}>

                        <View style={styles.metaIconeContainer}>
                          <Image
                            source={require('../../../assets/icones/IconMetas.png')}
                            style={styles.metaIcone}
                          />
                        </View>

                        <Text style={styles.metaNome}>
                          {meta.nome}
                        </Text>

                        {meta.data && (
                          <Text style={styles.metaData}>
                            {meta.data}
                          </Text>
                        )}

                        {/* Menu de opções (⋮) — TODO: implementar ação separada
                            (ex: abrir menu de editar/excluir meta) sem disparar
                            a navegação do card inteiro */}
                        <Text style={styles.metaMenu}>
                          ⋮
                        </Text>

                      </View>

                      <View style={styles.metaBarraFundo}>
                        <View
                          style={[
                            styles.metaBarraPreenchida,
                            { width: `${pct}%` },
                          ]}
                        />
                      </View>

                      <View style={styles.metaFooter}>
                        <Text style={styles.metaPrazo}>
                          {meta.prazo}
                        </Text>

                        <Text style={styles.metaValor}>
                          ${meta.valorAtual} de ${meta.valorTotal}
                        </Text>
                      </View>

                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>

          {/* ── METAS LONGO PRAZO ── */}
          <Text style={styles.secaoTitulo}>
            Metas longo prazo
          </Text>

          <View style={styles.longoPrazoGrid}>
            {METAS_LONGO_PRAZO.map(meta => (
              // Cada card de meta de longo prazo leva pros detalhes dela também
              // TODO: ajustar "/metas-detalhes" pro nome real da rota, se for diferente
              <TouchableOpacity
                key={meta.id}
                style={styles.longoPrazoCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/MetasDetalhes',
                    params: { id: meta.id },
                  })
                }
              >
                <LinearGradient
                  colors={[Cores.fundo.destaque, '#5a2dc7']}
                  style={styles.longoPrazoGradiente}
                >
                  <Text style={styles.longoPrazoNome}>
                    {meta.nome}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            {/* Card "+" — leva pra tela de criação de nova meta de longo prazo
                TODO: ajustar "/metas-futuras" pro nome real da rota, se for diferente */}
            <TouchableOpacity
              style={styles.longoPrazoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/MetasFuturas')}
            >
              <View style={styles.adicionarCard}>
                <Text style={styles.adicionarTexto}>+</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}