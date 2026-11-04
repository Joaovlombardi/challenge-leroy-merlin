import { useCallback, useEffect, useState } from 'react'

interface Estado<T> {
  dados: T | null
  carregando: boolean
  erro: string | null
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error && erro.message) return erro.message
  return 'Algo deu errado. Tente novamente.'
}

/**
 * Executa uma função assíncrona quando as dependências mudam e expõe
 * dados, carregando, erro e uma forma de tentar de novo.
 */
export function useCarregar<T>(carregar: () => Promise<T>, dependencias: readonly unknown[]) {
  const [estado, setEstado] = useState<Estado<T>>({ dados: null, carregando: true, erro: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setEstado((atual) => ({ ...atual, carregando: true, erro: null }))
    carregar()
      .then((dados) => {
        if (ativo) setEstado({ dados, carregando: false, erro: null })
      })
      .catch((erro: unknown) => {
        if (ativo) setEstado({ dados: null, carregando: false, erro: mensagemDeErro(erro) })
      })
    return () => {
      ativo = false
    }
    // A função "carregar" é recriada a cada render; quem controla a
    // reexecução são as dependências informadas por quem chama.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa])

  const recarregar = useCallback(() => setTentativa((valor) => valor + 1), [])

  return { ...estado, recarregar }
}
