import { usandoDadosSimulados } from '@/services/catalogo'

export function Rodape() {
  return (
    <footer className="mt-auto border-t border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="text-ink-700">Leroy Guia</strong> · MVP acadêmico do Challenge Leroy Merlin · FIAP 2026
        </p>
        <p>
          Lojas, produtos e estoques são de exemplo.{' '}
          {usandoDadosSimulados ? 'Modo: dados simulados.' : 'Modo: conectado à API.'}
        </p>
      </div>
    </footer>
  )
}
