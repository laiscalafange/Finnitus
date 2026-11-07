import { View, Text, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { styles } from './CalendarioSemanaStyles'
import { CalendarioSemanaProps, DiaSemana } from './CalendarioSemanaTypes'
import { GRADIENTS } from '../../constants/Gradientes'
import { Rotas } from '../../constants/Rotas'

const LETRAS_DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function getInicioSemana(data: Date) {
    const novaData = new Date(data)
    const dia = novaData.getDay()
    const diferenca = dia === 0 ? -6 : 1 - dia

    novaData.setDate(novaData.getDate() + diferenca)
    novaData.setHours(0, 0, 0, 0)

    return novaData
}

// AAAA-MM-DD na data local (toISOString usa UTC e pode mudar o dia)
export function chaveDia(data: Date) {
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')

    return `${data.getFullYear()}-${mes}-${dia}`
}

function getDiasSemana(data: Date): DiaSemana[] {
    const inicio = getInicioSemana(data)

    return Array.from({ length: 7 }, (_, i) => {
        const dia = new Date(inicio)
        dia.setDate(inicio.getDate() + i)

        return {
            data: dia,
            letra: LETRAS_DIAS[i],
            numero: String(dia.getDate()).padStart(2, '0'),
            chave: chaveDia(dia),
        }
    })
}

function formatarMes(data: Date) {
    const texto = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function CalendarioSemana({
    titulo,
    subtitulo,
    dataInicial = new Date(),
    mostrarSeta = true,
    diasMarcados = [],
    aoSelecionarDia,
    aoPressCoroa,
    aoPressSino,
}: CalendarioSemanaProps) {
    // Hook de navegação do Expo Router
    const router = useRouter()

    const [diaSelecionado, setDiaSelecionado] = useState(dataInicial)
    const [semanaOffset, setSemanaOffset] = useState(0)

    // A seta (⌄) abaixo do header esconde e mostra o calendário
    const [calendarioAberto, setCalendarioAberto] = useState(true)

    const inicioSemana = getInicioSemana(diaSelecionado)
    inicioSemana.setDate(inicioSemana.getDate() + semanaOffset * 7)

    const diasSemana = getDiasSemana(inicioSemana)
    const mesAtual = formatarMes(diasSemana[3].data)

    function selecionarDia(dia: DiaSemana) {
        setDiaSelecionado(dia.data)
        setSemanaOffset(0)
        aoSelecionarDia?.(dia.data)
    }

    return (
        <>
            <LinearGradient
                colors={GRADIENTS.header.colors}
                start={GRADIENTS.header.start}
                end={GRADIENTS.header.end}
                style={styles.header}
            >
                <View style={[styles.headerRow, !calendarioAberto && styles.headerRowFechado]}>
                    <View>
                        <Text style={styles.headerTitulo}>{titulo}</Text>
                        {subtitulo && (
                            <Text style={styles.headerSubtitulo}>{subtitulo}</Text>
                        )}
                    </View>

                    <View style={styles.headerIcones}>
                        {/* Coroa — se a tela que usa esse componente passar "aoPressCoroa",
                            usa a função dela; senão, por padrão leva pra tela Premium. */}
                        <TouchableOpacity
                            onPress={aoPressCoroa ?? (() => router.push(Rotas.premium))}
                        >
                            <Image
                                source={require('../../../../assets/icones/coroa.png')}
                                style={styles.icone}
                            />
                        </TouchableOpacity>

                        {/* Sino — mesma lógica: usa "aoPressSino" se vier por prop,
                            senão leva pra tela de Notificações por padrão. */}
                        <TouchableOpacity
                            onPress={aoPressSino ?? (() => router.push(Rotas.notificacao))}
                        >
                            <Image
                                source={require('../../../../assets/icones/sino.png')}
                                style={styles.icone}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {calendarioAberto && (
                    <>
                    <View style={styles.weekHeader}>
                        <TouchableOpacity
                            style={styles.weekArrow}
                            onPress={() => setSemanaOffset(prev => prev - 1)}
                        >
                            <Text style={styles.weekArrowTexto}>‹</Text>
                        </TouchableOpacity>

                        <Text style={styles.weekMes}>{mesAtual}</Text>

                        <TouchableOpacity
                            style={styles.weekArrow}
                            onPress={() => setSemanaOffset(prev => prev + 1)}
                        >
                            <Text style={styles.weekArrowTexto}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekStrip}>
                        {diasSemana.map(dia => {
                            const selecionado = dia.chave === chaveDia(diaSelecionado)
                            // Hoje (a data de verdade, não o dia selecionado)
                            const hoje = dia.chave === chaveDia(new Date())
                            // Dia com prazo de meta (hoje continua verde)
                            const marcado = diasMarcados.includes(dia.chave) && !hoje

                            return (
                                <TouchableOpacity
                                    key={dia.chave}
                                    style={[
                                        styles.diaContainer,
                                        marcado && styles.diaContainerMarcado,
                                        hoje && styles.diaContainerHoje,
                                        selecionado && styles.diaContainerAtivo,
                                    ]}
                                    onPress={() => selecionarDia(dia)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.diaLetra, hoje && styles.diaLetraHoje]}>
                                        {dia.letra}
                                    </Text>
                                    <Text style={[styles.diaNumero, hoje && styles.diaNumeroHoje]}>
                                        {dia.numero}
                                    </Text>
                                    <View
                                        style={[
                                            styles.diaPonto,
                                            selecionado && styles.diaPontoAtivo,
                                            hoje && styles.diaPontoHoje,
                                            marcado && styles.diaPontoMarcado,
                                        ]}
                                    />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    </>
                )}
            </LinearGradient>

            {mostrarSeta && (
                <View style={styles.setaContainer}>
                    <TouchableOpacity
                        style={styles.setaCirculo}
                        onPress={() => setCalendarioAberto(atual => !atual)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={
                            calendarioAberto ? 'Esconder calendário' : 'Mostrar calendário'
                        }
                    >
                        <Text style={styles.setaTexto}>{calendarioAberto ? '⌃' : '⌄'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}