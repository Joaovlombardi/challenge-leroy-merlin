import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Loja } from '@/types/api'
import { lerLojaAtual, limparLojaAtual, salvarLojaAtual } from '@/lib/lojaAtual'

interface LojaAtualContexto {
  lojaAtual: Loja | null
  definirLojaAtual: (loja: Loja) => void
  sairDaLoja: () => void
}

const Contexto = createContext<LojaAtualContexto | null>(null)

export function LojaAtualProvider({ children }: { children: ReactNode }) {
  const [lojaAtual, setLojaAtual] = useState<Loja | null>(() => lerLojaAtual())

  const definirLojaAtual = useCallback((loja: Loja) => {
    salvarLojaAtual(loja)
    setLojaAtual(loja)
  }, [])

  const sairDaLoja = useCallback(() => {
    limparLojaAtual()
    setLojaAtual(null)
  }, [])

  const valor = useMemo(
    () => ({ lojaAtual, definirLojaAtual, sairDaLoja }),
    [lojaAtual, definirLojaAtual, sairDaLoja],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

/** Loja em que o cliente está (escolhida na tela inicial ou via QR code). */
export function useLojaAtual(): LojaAtualContexto {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useLojaAtual precisa estar dentro de LojaAtualProvider')
  return contexto
}
