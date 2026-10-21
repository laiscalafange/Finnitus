import { useState } from 'react'
import { Text, View } from 'react-native'

import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { styles as form } from '@/features/menuMais/styles/formulario'
import { styles as modal } from '@/features/menuMais/components/ModalReserva/styles'
import {
  dataValida,
  formatarMoeda,
  hojeFormatado,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from '@/features/menuMais/utils'
import { useFinanceiro } from '@/features/financeiroContext'
import { diasAte, estaAberta, nomeCompetencia, type ContaDoMes } from '../../contasData'
import { styles } from '../../styles'
import { ModalCartao } from '../ContaUI'

// "Confirmar pagamento / recebimento" agora é um modal (antes era uma tela).
// A pessoa revisa a data e o valor que realmente aconteceram e só então o app
// registra. Nunca é automático.
//
// ConfirmarContaConteudo é só o miolo do card: dá pra colocá-lo dentro de um
// ModalCartao que já está aberto (Notificações e Movimentações trocam o
// conteúdo do mesmo modal, pra nunca ter dois modais empilhados).
// ModalConfirmarConta é o modal completo, pra quem não tem outro modal aberto
// (Detalhes da conta).
//
// Monte o ConfirmarContaConteudo só quando for abrir: o formulário começa
// sempre com a data de hoje e o valor previsto.
export function ConfirmarContaConteudo({
  conta,
  aoFechar,
}: {
  conta: ContaDoMes
  aoFechar: () => void
}) {
  const { registrarBaixa } = useFinanceiro()

  // Já vem com a data de hoje e o valor previsto, pra revisar
  const [data, setData] = useState(hojeFormatado())
  const [valor, setValor] = useState(
    mascararMoeda(String(Math.round(conta.valorPrevisto * 100))),
  )
  const [erro, setErro] = useState('')

  const entrada = conta.tipo === 'entrada'
  const palavra = entrada ? 'recebimento' : 'pagamento'
  const titulo = entrada ? 'Confirmar recebimento' : 'Confirmar pagamento'

  // Conta que não é fixa ou já foi registrada neste mês
  if (!conta.recorrente || !estaAberta(conta)) {
    return (
      <>
        <Text style={[modal.titulo, modal.tituloCentro]}>{titulo}</Text>
        <Text style={styles.vazio}>
          Essa conta não está mais aguardando confirmação neste mês.
        </Text>
        <View style={modal.botoes}>
          <Button titulo="Fechar" variante="outline" onPress={aoFechar} />
        </View>
      </>
    )
  }

  const valorNumero = moedaParaNumero(valor)
  const diferenca = Math.round((valorNumero - conta.valorPrevisto) * 100) / 100

  function confirmar() {
    if (valorNumero <= 0) {
      setErro(`Informe o valor ${entrada ? 'recebido' : 'pago'}.`)
      return
    }

    if (!dataValida(data)) {
      setErro('Informe uma data válida (DD/MM/AAAA).')
      return
    }

    // Não dá pra confirmar algo que ainda não aconteceu
    if (diasAte(data) > 0) {
      setErro(
        `A data não pode ser futura. Confirme só depois de ${entrada ? 'receber' : 'pagar'}.`,
      )
      return
    }

    const resultado = registrarBaixa({
      transacaoId: conta.transacaoId,
      competencia: conta.competencia,
      dataRealizada: data,
      valorRealizado: valorNumero,
    })

    if (resultado !== 'ok') {
      setErro('Esse mês já foi registrado ou a conta não existe mais.')
      return
    }

    aoFechar()
  }

  return (
    <>
      <Text style={[modal.titulo, modal.tituloCentro]}>{titulo}</Text>
      <Text style={styles.modalSubtitulo}>{nomeCompetencia(conta.competencia)}</Text>

      <Text style={styles.pergunta}>
        Você está confirmando que o {palavra} de{' '}
        <Text style={styles.perguntaDestaque}>{conta.nome}</Text> no valor previsto de{' '}
        <Text style={styles.perguntaDestaque}>{formatarMoeda(conta.valorPrevisto)}</Text> foi
        realizado?
      </Text>

      <Input
        label={entrada ? 'Data do recebimento' : 'Data do pagamento'}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        maxLength={10}
        value={data}
        onChangeText={(texto) => setData(mascararData(texto))}
      />

      <Input
        label={entrada ? 'Valor recebido' : 'Valor pago'}
        placeholder="0,00"
        keyboardType="numeric"
        value={valor}
        onChangeText={(texto) => setValor(mascararMoeda(texto))}
        icone={<Text style={form.prefixoMoeda}>R$</Text>}
      />

      {/* O previsto fica guardado separado do valor realizado */}
      {valorNumero > 0 && diferenca !== 0 ? (
        <Text style={styles.aviso}>
          {entrada && diferenca < 0 ? 'Será registrado como recebimento parcial. ' : ''}
          Diferença de {formatarMoeda(Math.abs(diferenca))} {diferenca > 0 ? 'a mais' : 'a menos'}{' '}
          que o previsto. O valor previsto ({formatarMoeda(conta.valorPrevisto)}) continua
          guardado no histórico.
        </Text>
      ) : null}

      {erro ? (
        <Text style={form.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}

      <View style={modal.botoes}>
        <Button titulo={titulo} onPress={confirmar} />
        <Button titulo="Cancelar" variante="botaotexto" onPress={aoFechar} />
      </View>
    </>
  )
}

// Modal completo (card flutuante com fundo escurecido)
export function ModalConfirmarConta({
  visible,
  conta,
  aoFechar,
}: {
  visible: boolean
  conta: ContaDoMes
  aoFechar: () => void
}) {
  return (
    <ModalCartao visible={visible} aoFechar={aoFechar}>
      {visible ? (
        <ConfirmarContaConteudo
          key={`${conta.transacaoId}-${conta.competencia}`}
          conta={conta}
          aoFechar={aoFechar}
        />
      ) : null}
    </ModalCartao>
  )
}