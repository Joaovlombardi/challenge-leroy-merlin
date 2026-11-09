import { useState, type FormEvent } from 'react'
import type { Chamado, Produto } from '@/types/api'
import { chamados } from '@/services/chamados'
import { mensagemDeErro } from '@/hooks/useCarregar'
import { AlertaErro, Botao } from '@/components/ui'
import { AcompanharChamado } from './AcompanharChamado'

interface FormularioChamadoProps {
  lojaId: number
  /** Produto sobre o qual o cliente quer ajuda (opcional). */
  produto: Produto | null
  aoFechar: () => void
}

/**
 * Painel para o cliente pedir ajuda de um vendedor. Envia o chamado com
 * POST /api/chamados e, depois de enviado, mostra o andamento do chamado.
 */
export function FormularioChamado({ lojaId, produto, aoFechar }: FormularioChamadoProps) {
  const [descricao, setDescricao] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [chamadoCriado, setChamadoCriado] = useState<Chamado | null>(null)

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      const chamado = await chamados.abrir({ lojaId, produtoId: produto?.id, descricao })
      setChamadoCriado(chamado)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setEnviando(false)
    }
  }

  // Depois de enviado, o painel passa a mostrar o andamento do chamado.
  if (chamadoCriado) {
    return <AcompanharChamado chamado={chamadoCriado} aoFechar={aoFechar} />
  }

  return (
    <form onSubmit={enviar} className="rounded-m border border-line bg-surface-2 p-5">
      <h2 className="text-lg font-semibold text-ink">Chamar um vendedor</h2>
      {produto ? (
        <p className="mt-1 text-sm text-ink-2">
          Sobre: <strong className="font-semibold text-ink">{produto.nome}</strong> (corredor {produto.corredor})
        </p>
      ) : (
        <p className="mt-1 text-sm text-ink-2">Conte o que você precisa e um vendedor vem te ajudar.</p>
      )}

      <label htmlFor="descricao-chamado" className="mt-4 mb-1.5 block text-sm font-semibold text-ink-2">
        Como podemos ajudar?
      </label>
      <textarea
        id="descricao-chamado"
        rows={3}
        required
        value={descricao}
        onChange={(evento) => setDescricao(evento.target.value)}
        placeholder={
          produto
            ? `Ex.: Estou no corredor ${produto.corredor} e tenho uma dúvida sobre este produto.`
            : 'Ex.: Estou na entrada e preciso de ajuda para escolher uma tinta.'
        }
        className="w-full rounded-m border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none"
      />

      {erro && (
        <div className="mt-3">
          <AlertaErro mensagem={erro} />
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Botao type="submit" disabled={enviando || !descricao.trim()}>
          {enviando ? 'Enviando…' : 'Enviar chamado'}
        </Botao>
        <Botao variante="fantasma" onClick={aoFechar}>
          Cancelar
        </Botao>
      </div>
    </form>
  )
}
