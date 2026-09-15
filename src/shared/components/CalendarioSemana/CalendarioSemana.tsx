import { View, Text, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { styles } from './CalendarioSemanaStyles'
import { CalendarioSemanaProps, DiaSemana } from './CalendarioSemanaTypes'
import { GRADIENTS } from '../../constants/Gradientes'

const LETRAS_DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function getInicioSemana(data: Date) {
    const novaData = new Date(data)
    const dia = novaData.getDay()
    const diferenca = dia === 0 ? -6 : 1 - dia

    novaData.setDate(novaData.getDate() + diferenca)
    novaData.setHours(0, 0, 0, 0)

    return novaData
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
            chave: dia.toISOString().split('T')[0],
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
    mostrarAcoes = false,
    aoSelecionarDia,
    aoPressCoroa,
    aoPressSino,
    aoPressAdicionar,
    aoPressEditar,
}: CalendarioSemanaProps) {
    // Hook de navegação do Expo Router
    const router = useRouter()

    const [diaSelecionado, setDiaSelecionado] = useState(dataInicial)
    const [semanaOffset, setSemanaOffset] = useState(0)

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
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.headerTitulo}>{titulo}</Text>
                        {subtitulo && (
                            <Text style={styles.headerSubtitulo}>{subtitulo}</Text>
                        )}
                    </View>

                    <View style={styles.headerIcones}>
                        {/* Coroa — se a tela que usa esse componente passar "aoPressCoroa",
                            usa a função dela; senão, por padrão leva pra tela Premium.
                            TODO: ajustar "/premium" pro nome real da rota, se for diferente */}
                        <TouchableOpacity
                            onPress={aoPressCoroa ?? (() => router.push('/Premium'))}
                        >
                            <Image
                                source={require('../../../../assets/icones/coroa.png')}
                                style={styles.icone}
                            />
                        </TouchableOpacity>

                        {/* Sino — mesma lógica: usa "aoPressSino" se vier por prop,
                            senão leva pra tela de Notificações por padrão.
                            TODO: ajustar "/notificacoes" pro nome real da rota, se for diferente */}
                        <TouchableOpacity
                            onPress={aoPressSino ?? (() => router.push('/Notificacao'))}
                        >
                            <Image
                                source={require('../../../../assets/icones/sino.png')}
                                style={styles.icone}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

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
                        const selecionado =
                            dia.chave === diaSelecionado.toISOString().split('T')[0]

                        return (
                            <TouchableOpacity
                                key={dia.chave}
                                style={[
                                    styles.diaContainer,
                                    selecionado && styles.diaContainerAtivo,
                                ]}
                                onPress={() => selecionarDia(dia)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.diaLetra}>{dia.letra}</Text>
                                <Text style={styles.diaNumero}>{dia.numero}</Text>
                                <View
                                    style={[
                                        styles.diaPonto,
                                        selecionado && styles.diaPontoAtivo,
                                    ]}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {mostrarAcoes && (
                    <View style={styles.acoesRow}>
                        <TouchableOpacity
                            style={styles.acaoBotao}
                            onPress={aoPressAdicionar}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.acaoTexto}>+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.acaoBotao}
                            onPress={aoPressEditar}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={require('../../../../assets/icones/lapis.png')}
                                style={styles.acaoIcone}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>

            {mostrarSeta && (
                <View style={styles.setaContainer}>
                    <View style={styles.setaCirculo}>
                        <Text style={styles.setaTexto}>⌄</Text>
                    </View>
                </View>
            )}
        </>
    )
}