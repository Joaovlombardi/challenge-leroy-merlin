import {
  BASE_PRATELEIRAS,
  ENTRADA,
  LETRAS_CORREDORES,
  TOPO_PRATELEIRAS,
  Y_CORREDOR_PRINCIPAL,
  localizarCorredor,
  xDoCorredor,
} from '@/lib/planta'

interface PlantaLojaProps {
  /** Corredor do produto, por exemplo "C4". Sem ele, mostra só a planta. */
  corredor?: string
}

/**
 * Desenho simplificado da loja, visto de cima, com a rota da entrada até o
 * corredor do produto. A rota é sempre a mesma ideia: entrar, seguir pelo
 * corredor principal até a letra certa e subir até o trecho certo.
 */
export function PlantaLoja({ corredor }: PlantaLojaProps) {
  const destino = corredor ? localizarCorredor(corredor) : null

  // Prateleiras: uma em cada parede lateral e uma entre cada par de corredores.
  const prateleiras = [
    { x: 8, largura: 22 },
    ...LETRAS_CORREDORES.slice(0, -1).map((letra) => ({ x: xDoCorredor(letra) + 10, largura: 28 })),
    { x: 290, largura: 22 },
  ]

  // Rota: entrada → corredor principal → corredor da letra → trecho.
  const pontosDaRota = destino
    ? [
        [ENTRADA.x, ENTRADA.y],
        [ENTRADA.x, Y_CORREDOR_PRINCIPAL],
        [destino.x, Y_CORREDOR_PRINCIPAL],
        [destino.x, destino.y],
      ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ')
    : ''

  const descricao = destino
    ? `Planta da loja. Da entrada, siga pelo corredor principal até o corredor ${destino.letra} e avance até o trecho ${destino.trecho}.`
    : 'Planta da loja com os corredores de A a F.'

  return (
    <svg viewBox="0 0 320 340" role="img" aria-label={descricao} className="w-full max-w-md">
      {/* Paredes da loja, com a abertura da entrada embaixo */}
      <rect x={8} y={8} width={304} height={300} rx={8} className="fill-white stroke-line" strokeWidth={2} />
      <line x1={ENTRADA.x - 22} y1={ENTRADA.y} x2={ENTRADA.x + 22} y2={ENTRADA.y} className="stroke-white" strokeWidth={4} />

      {/* Prateleiras */}
      {prateleiras.map(({ x, largura }) => (
        <rect
          key={x}
          x={x}
          y={TOPO_PRATELEIRAS}
          width={largura}
          height={BASE_PRATELEIRAS - TOPO_PRATELEIRAS}
          rx={3}
          className="fill-surface-2 stroke-line"
        />
      ))}

      {/* Letras dos corredores */}
      {LETRAS_CORREDORES.map((letra) => (
        <text
          key={letra}
          x={xDoCorredor(letra)}
          y={26}
          textAnchor="middle"
          className={`text-[13px] font-semibold ${letra === destino?.letra ? 'fill-accent' : 'fill-ink-3'}`}
        >
          {letra}
        </text>
      ))}

      {/* Caixas, perto da entrada */}
      {[30, 62, 94].map((x) => (
        <rect key={x} x={x} y={282} width={24} height={12} rx={2} className="fill-surface-2 stroke-line" />
      ))}
      <text x={78} y={304} textAnchor="middle" className="fill-ink-3 text-[9px]">
        Caixas
      </text>

      <text x={ENTRADA.x} y={328} textAnchor="middle" className="fill-ink-2 text-[11px] font-semibold">
        Entrada
      </text>

      {destino && (
        <>
          {/* Trecho do produto em destaque */}
          <rect
            x={destino.x - 22}
            y={destino.y - 20}
            width={44}
            height={40}
            rx={6}
            className="fill-accent-bg stroke-brand"
            strokeWidth={2}
          />

          {/* Caminho até o produto */}
          <polyline
            points={pontosDaRota}
            fill="none"
            className="stroke-accent"
            strokeWidth={3}
            strokeDasharray="6 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ponto de partida e ponto de chegada */}
          <circle cx={ENTRADA.x} cy={ENTRADA.y} r={6} className="fill-white stroke-accent" strokeWidth={3} />
          <circle cx={destino.x} cy={destino.y} r={8} className="fill-accent" />
          <circle cx={destino.x} cy={destino.y} r={3} className="fill-white" />
        </>
      )}
    </svg>
  )
}
