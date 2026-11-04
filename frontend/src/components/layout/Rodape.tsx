import { usandoDadosSimulados } from '@/services/catalogo'

export function Rodape() {
  return (
    <footer className="mt-auto border-t-4 border-brand bg-surface-inverse text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-white/70 sm:flex-row sm:justify-between">
        <p>
          <span className="font-semibold text-white">Leroy Guia</span> · MVP acadêmico do Challenge LEROY MERLIN ·
          FIAP 2026
        </p>
        <p>
          Lojas, produtos e estoques são de exemplo.{' '}
          {usandoDadosSimulados ? 'Dados simulados.' : 'Conectado à API.'}
        </p>
      </div>
    </footer>
  )
}
