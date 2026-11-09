import type { Produto } from '@/types/api'
import { Avaliacao, Botao, BotaoLink, Cartao, Icone, SeloEstoque } from '@/components/ui'
import { formatarPreco } from '@/lib/texto'

interface CartaoProdutoProps {
  produto: Produto
  aoChamarVendedor: () => void
}

/** Um produto da loja: nome, preço, estoque, onde fica e o que fazer com ele. */
export function CartaoProduto({ produto, aoChamarVendedor }: CartaoProdutoProps) {
  return (
    <Cartao className="flex flex-col p-5">
      <h3 className="font-semibold text-ink">{produto.nome}</h3>
      {produto.marca && <p className="mt-0.5 text-sm text-ink-3">{produto.marca}</p>}
      {produto.avaliacao !== undefined && (
        <div className="mt-2">
          <Avaliacao nota={produto.avaliacao} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="mr-auto text-xl font-semibold text-ink">{formatarPreco(produto.preco)}</p>
        <SeloEstoque estoque={produto.estoque} />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-2">
        <Icone nome="pin" tamanho={16} className="text-accent" />
        Corredor <strong className="font-semibold text-ink">{produto.corredor}</strong> · {produto.secao}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <BotaoLink to={`/loja/${produto.lojaId}/produto/${produto.id}`} tamanho="sm">
          <Icone nome="rota" tamanho={16} />
          Ver no mapa
        </BotaoLink>
        <Botao variante="secundario" tamanho="sm" onClick={aoChamarVendedor}>
          Chamar vendedor
        </Botao>
      </div>
    </Cartao>
  )
}
