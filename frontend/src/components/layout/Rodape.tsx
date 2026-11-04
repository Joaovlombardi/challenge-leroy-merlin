import { usandoDadosSimulados } from '@/services/catalogo'

export function Rodape() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-ink-3 sm:flex-row sm:justify-between">
        <p>Leroy Guia · MVP acadêmico do Challenge LEROY MERLIN · FIAP 2026</p>
        <p>
          Lojas, produtos e estoques são de exemplo.{' '}
          {usandoDadosSimulados ? 'Dados simulados.' : 'Conectado à API.'}
        </p>
      </div>
    </footer>
  )
}
