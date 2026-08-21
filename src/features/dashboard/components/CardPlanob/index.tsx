import { Text, View } from 'react-native'
import { PlanoBResumo } from '../../types'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
import { styles } from './styles'

type Props={dados?:PlanoBResumo}
export function CardPlanob({dados}:Props){const p=dados?Math.min(100,Math.max(0,dados.valorAtual/Math.max(dados.valorMeta,1)*100)):0;return <View style={styles.container}><View style={styles.cabecalho}><Text style={styles.titulo}>Plano-B</Text><Text style={styles.subtitulo}>{dados?.nome??'Módulo em preparação'}</Text></View><View style={styles.corpo}><View style={styles.circulo}><View style={[styles.progresso,{transform:[{rotate:`${p*3.6}deg`}]}]}/><Text style={styles.percentual}>{dados?`${Math.round(p)}%`:'—'}</Text></View><View style={styles.textos}><Text style={styles.valor}>{dados?`R$ ${dados.valorAtual.toLocaleString('pt-BR',{minimumFractionDigits:2})}`:'Dados ainda não disponíveis'}</Text><Text style={styles.descricao}>{dados?`Meta de R$ ${dados.valorMeta.toLocaleString('pt-BR',{minimumFractionDigits:2})}`:'A estrutura está pronta para receber o resumo do Plano-B.'}</Text></View></View></View>}
