import { Text, View } from 'react-native'
import Svg,{Line,Polyline} from 'react-native-svg'
import { EstatisticaResumo } from '../../types'
import { styles } from './styles'

type Props={dados?:EstatisticaResumo[]}
export function GraficoEstatisticas({dados}:Props){
 const tem=Boolean(dados?.length),w=250,h=92,max=tem?Math.max(...dados!.flatMap(x=>[x.receitas,x.despesas]),1):1
 const pontos=(key:'receitas'|'despesas')=>tem?dados!.map((x,i)=>`${(i/Math.max(dados!.length-1,1))*w},${h-(x[key]/max)*(h-10)}`).join(' '):''
 return <View style={styles.container}><View style={styles.cabecalho}><Text style={styles.titulo}>Estatísticas</Text><Text style={styles.periodo}>Semana</Text></View><View style={styles.grafico}>{tem?<Svg width="100%" height={h+25} viewBox={`0 0 ${w} ${h+25}`}>{[20,43,66,89].map(y=><Line key={y} x1="0" x2={w} y1={y} y2={y} stroke="#6D4B9D" strokeWidth=".6"/>)}<Polyline points={pontos('receitas')} fill="none" stroke="#B7FF00" strokeWidth="3"/><Polyline points={pontos('despesas')} fill="none" stroke="#C48CFF" strokeWidth="2"/></Svg>:<View style={styles.vazio}><Text style={styles.vazioTitulo}>Dados de estatísticas ainda não disponíveis</Text><Text style={styles.vazioTexto}>O gráfico será alimentado pela funcionalidade financeira quando ela estiver conectada.</Text></View>}</View></View>
}
