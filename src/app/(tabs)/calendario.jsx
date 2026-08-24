import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle } from 'react-native-svg'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useState } from 'react'
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Cores } from '../../shared/constants/Cores'
import { FONTS } from '../../shared/constants/Tipografia'
import {
  TRANSACOES_MOCK,
  EVENTOS_MES_MOCK,
} from '../../shared/components/Mocks';
import { styles } from '../../styles/calendariostyle'

// ── LOCALE ─────────────────────────────────────

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta',
    'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'],
}

LocaleConfig.defaultLocale = 'pt'

// ── DATAS MOCK ─────────────────────────────────

const markedDatesBase = {
  '2026-02-18': {
    marked: true,
    dotColor: Cores.estado.perigo,
  },

  '2026-02-21': {
    marked: true,
    dotColor: Cores.estado.perigo,
  },
}

// ── GAUGE ──────────────────────────────────────

function GaugeCircular({ tamanho = 100, label, sublabel, segmentos }) {
  const r = (tamanho - 25) / 2
  const cx = tamanho / 2
  const cy = tamanho / 2
  const circ = 2 * Math.PI * r

  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <Svg
        width={tamanho}
        height={tamanho}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {segmentos?.map((seg, i) => {
          const len = (seg.pct / 100) * circ
          const offset = segmentos
            .slice(0, i)
            .reduce((acc, s) => acc + (s.pct / 100) * circ, 0)

          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.cor}
              strokeWidth={15}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          )
        })}
      </Svg>

      <View
        style={{
          position: 'absolute',
          inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.gaugeLabel}>{label}</Text>
        <Text style={styles.gaugeSublabel}>{sublabel}</Text>
      </View>
    </View>
  )
}

// ── COMPONENTE PRINCIPAL ──────────────────────

export default function Calendario() {
  
  const [dataSelecionada, setDataSelecionada] = useState(null)
  const [mesAtual, setMesAtual] = useState('2026-02-09')

  const dataMes = new Date(`${mesAtual}T12:00:00`)
  const nomeMes = LocaleConfig.locales.pt.monthNames[dataMes.getMonth()]
  const anoAtual = dataMes.getFullYear()

  const markedDates = {
    ...markedDatesBase,

    ...(dataSelecionada && {
      [dataSelecionada]: {
        ...markedDatesBase[dataSelecionada],
        selected: true,
        selectedColor: Cores.destaque.limao,
      },
    }),
  }

  return (
    <View style={{ flex: 1 }}>
    <BackgroundGradient />
      <ScrollView style={styles.scroll}>

        {/* ── HEADER ───────────────────────────── */}

        <LinearGradient
          colors={['#A357FF', '#7E3BED', '#8541F6']}
          style={styles.header}
        >

          <View style={styles.headerRow}>
            <View>

              <Text
                style={[
                  styles.headerAno,
                  {
                    fontFamily: FONTS.raleway.extrabold,
                    fontSize: 27,
                  },
                ]}
              >
                Plano do mês
              </Text>

              <Text style={styles.headerAno}>
                {anoAtual}
              </Text>

              <Text style={styles.headerMes}>
                {nomeMes} ⌄
              </Text>

            </View>

            <View style={styles.headerIcones}>
              <Text style={styles.headerIcone}>👑</Text>
              <Text style={styles.headerIcone}>🔔</Text>
            </View>
          </View>

          {/* ── CALENDÁRIO ───────────────────── */}

          <Calendar
            current={mesAtual}
            markedDates={markedDates}
            enableSwipeMonths
            hideExtraDays={false}
            firstDay={1}

            style={{
              marginTop: 10,
            }}

            onMonthChange={(month) => {
              setMesAtual(month.dateString)
            }}

            renderArrow={(direction) => (
              <Text
                style={{
                  color: Cores.destaque.limao,
                  fontSize: 20,
                }}
              >
                {direction === 'left' ? '‹' : '›'}
              </Text>
            )}

            dayComponent={({ date, state, marking }) => {
              const isSelected =
                date?.dateString === dataSelecionada

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setDataSelecionada(date.dateString)
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    margin: 2,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isSelected
                      ? Cores.destaque.limao
                      : '#53269D',
                  }}
                >

                  <Text
                    style={{
                      fontFamily: FONTS.raleway.bold,
                      fontSize: 13,
                      color: isSelected
                        ? Cores.roxo.escuro
                        : state === 'disabled'
                          ? '#36166C'
                          : '#A966FBF8',
                    }}
                  >
                    {date.day}
                  </Text>

                  {marking?.marked && !isSelected && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor:
                          marking.dotColor ||
                          Cores.estado.perigo,
                        marginTop: 3,
                      }}
                    />
                  )}

                </TouchableOpacity>
              )
            }}

            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#e3d9ff',
              monthTextColor: Cores.destaque.limao,
              textMonthFontFamily: FONTS.raleway.extrabold,
              textMonthFontSize: 18,
              textDayHeaderFontFamily: FONTS.quicksand.regular,
              textDayHeaderFontSize: 14,
              arrowColor: Cores.destaque.limao,
            }}
          />

        </LinearGradient>

        {/* ── SETA ───────────────────────────── */}

        <View style={styles.setaContainer}>
          <View style={styles.setaCirculo}>
            <Text style={styles.setaTexto}>⌄</Text>
          </View>
        </View>

        {/* ── CONTEÚDO ───────────────────────── */}

        <View style={styles.conteudo}>

          <Text style={styles.secaoTitulo}>
            Visão geral
          </Text>

          {/* ── EVENTOS ─────────────────────── */}

          <LinearGradient
            colors={['#3c1e75', '#30096e']}
            style={styles.card}
          >

            <View style={styles.eventoHeader}>
              <Text style={styles.eventoTitulo}>
                Eventos
              </Text>

              <Text style={styles.eventoData}>
                {dataSelecionada
                  ? dataSelecionada.split('-').reverse().join('/')
                  : '09/02'}
              </Text>
            </View>

            {EVENTOS_MES_MOCK.map((ev, i) => (
              <View key={i} style={styles.eventoItem}>
                <Text style={styles.eventoNome}>
                  • {ev.nome}
                </Text>

                <Text style={styles.eventoDescricao}>
                  • {ev.descricao}
                </Text>

                <Text style={styles.eventoHora}>
                  {ev.hora}
                </Text>
              </View>
            ))}

          </LinearGradient>

          {/* ── GASTOS DO DIA ───────────────── */}

          <Text style={styles.secaoTitulo}>
            Gastos do dia
          </Text>

          {TRANSACOES_MOCK.map((t) => (
            <LinearGradient
              key={t.id}
              colors={['#30096e', '#30096e']}
              style={styles.gastoCard}
            >

              <View
                style={[
                  styles.gastoIconeContainer,
                  {
                    backgroundColor: '#5f33a77a',
                    borderWidth: 1,
                    borderColor: '#7F3BED',
                    borderRadius: 100,
                  },
                ]}
              >
                <Text style={styles.gastoIconeTexto}>
                  {t.icone}
                </Text>
              </View>

              <View style={styles.gastoInfo}>
                <Text style={styles.gastoNome}>
                  {t.nome}
                </Text>

                <Text style={styles.gastoHora}>
                  {t.hora}
                </Text>
              </View>

              <Text
                style={[
                  styles.gastoValor,
                  {
                    color:
                      t.tipo === 'entrada'
                        ? Cores.destaque.limao
                        : Cores.base.branco,
                  },
                ]}
              >
                R$ {t.valor.toFixed(2)}
              </Text>

            </LinearGradient>
          ))}

          {/* ── GASTOS DO MÊS ───────────────── */}

          <Text style={styles.secaoTitulo}>
            Gastos do mês
          </Text>

          <LinearGradient
            colors={['#34176b', '#30096e']}
            style={styles.card}
          >

            <View style={styles.gastosMesCorpo}>

              <GaugeCircular
                tamanho={140}
                label="R$100"
                sublabel="Restante"
                segmentos={[
                  {
                    cor: Cores.destaque.limao,
                    pct: 40,
                  },
                  {
                    cor: '#FF8800',
                    pct: 30,
                  },
                  {
                    cor: Cores.roxo.claro,
                    pct: 30,
                  },
                ]}
              />

              <View style={styles.estatsList}>

                {[
                  {
                    label: 'Renda da\núltima semana',
                    valor: '↓ 4,6%',
                    cor: Cores.destaque.limao,
                  },
                  {
                    label: 'Gastos da\núltima semana',
                    valor: '↑ 19%',
                    cor: '#FF8800',
                  },
                  {
                    label: 'Economias da\núltima semana',
                    valor: '↓ 19%',
                    cor: Cores.roxo.claro,
                  },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={styles.estatsItem}
                  >
                    <Text style={styles.estatsLabel}>
                      {item.label}
                    </Text>

                    <Text
                      style={[
                        styles.estatsValor,
                        { color: item.cor },
                      ]}
                    >
                      {item.valor}
                    </Text>
                  </View>
                ))}

              </View>

            </View>

            {/* ── LEGENDA ───────────────────── */}

            <View style={styles.legenda}>

              {[
                {
                  cor: Cores.destaque.limao,
                  label: 'Renda',
                },
                {
                  cor: '#FF8800',
                  label: 'Gastos',
                },
                {
                  cor: Cores.roxo.claro,
                  label: 'Economias',
                },
              ].map((l) => (
                <View
                  key={l.label}
                  style={styles.legendaItem}
                >

                  <View
                    style={[
                      styles.legendaPonto,
                      { backgroundColor: l.cor },
                    ]}
                  />

                  <Text style={styles.legendaTexto}>
                    {l.label}
                  </Text>

                </View>
              ))}

            </View>

          </LinearGradient>

        </View>

      </ScrollView>
       </View>
  )
}