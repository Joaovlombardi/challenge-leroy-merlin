import { useEffect, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Cabecalho } from './Cabecalho'
import { Rodape } from './Rodape'

/** Volta ao topo a cada troca de página. */
function RolarParaTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <RolarParaTopo />
      <Cabecalho />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-16">
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}

/** Tracinho verde que antecede títulos de seção: a assinatura visual do site. */
function Traco() {
  return <span aria-hidden="true" className="mb-3 block h-1 w-8 bg-brand" />
}

/** Título de seção dentro de uma página. */
export function TituloSecao({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-ink">
      <Traco />
      {children}
    </h2>
  )
}

interface TituloPaginaProps {
  titulo: string
  descricao?: string
  acoes?: ReactNode
}

/** Cabeçalho padrão das páginas internas. */
export function TituloPagina({ titulo, descricao, acoes }: TituloPaginaProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Traco />
        <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-ink-2 md:text-base">{descricao}</p>}
      </div>
      {acoes && <div className="flex shrink-0 gap-2">{acoes}</div>}
    </div>
  )
}
