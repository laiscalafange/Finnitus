import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type FinanceiroState = {
  salario?: number
  despesas?: number
  economiaFutura?: number
  tempoEconomia?: number
  metasSelecionadas: string[]
}

type FinanceiroContextValue = FinanceiroState & {
  setSalario: (valor?: number) => void
  setDespesas: (valor?: number) => void
  setEconomiaFutura: (valor?: number) => void
  setTempoEconomia: (valor?: number) => void
  setMetasSelecionadas: (metas: string[]) => void
}

const FinanceiroContext = createContext<FinanceiroContextValue | undefined>(undefined)

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  const [salario, setSalario] = useState<number | undefined>()
  const [despesas, setDespesas] = useState<number | undefined>()
  const [economiaFutura, setEconomiaFutura] = useState<number | undefined>()
  const [tempoEconomia, setTempoEconomia] = useState<number | undefined>()
  const [metasSelecionadas, setMetasSelecionadas] = useState<string[]>([])

  const value = useMemo(
    () => ({
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,
      setSalario,
      setDespesas,
      setEconomiaFutura,
      setTempoEconomia,
      setMetasSelecionadas,
    }),
    [salario, despesas, economiaFutura, tempoEconomia, metasSelecionadas],
  )

  return <FinanceiroContext.Provider value={value}>{children}</FinanceiroContext.Provider>
}

export function useFinanceiro() {
  const context = useContext(FinanceiroContext)
  if (!context) {
    throw new Error('useFinanceiro deve ser usado dentro de FinanceiroProvider')
  }
  return context
}
