import { BotaoLink, EstadoVazio } from '@/components/ui'

export function NaoEncontrada() {
  return (
    <div className="mx-auto max-w-xl">
      <EstadoVazio icone="rota" titulo="Página não encontrada" descricao="Esse caminho não existe na loja.">
        <BotaoLink to="/">Voltar ao início</BotaoLink>
      </EstadoVazio>
    </div>
  )
}
