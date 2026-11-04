import { usandoDadosSimulados } from '@/services/catalogo'

export function Rodape() {
  return (
    <footer className="mt-auto bg-surface-inverse text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="font-semibold text-white">Leroy Guia</strong> · MVP acadêmico do Challenge LEROY MERLIN ·
          FIAP 2026
        </p>
        <p>
          Lojas, produtos e estoques são de exemplo.{' '}
          {usandoDadosSimulados ? 'Modo: dados simulados.' : 'Modo: conectado à API.'}
        </p>
      </div>
    </footer>
  )
}
