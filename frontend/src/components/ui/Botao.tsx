import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

/**
 * Variantes conforme o guia de identidade visual:
 * - primario: botão principal (fundo accent, texto branco)
 * - secundario: botão contornado (fundo branco, borda verde de marca, texto accent)
 * - neutro: botão neutro (fundo cinza-azulado escuro, texto branco)
 * - fantasma: só texto, para ações discretas
 */
export type VarianteBotao = 'primario' | 'secundario' | 'neutro' | 'fantasma'
export type TamanhoBotao = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-s font-semibold whitespace-nowrap transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-inverse',
  secundario: 'border border-brand bg-white text-accent hover:bg-accent-bg active:bg-accent-bg',
  neutro: 'bg-neutral-btn text-white hover:bg-surface-inverse',
  fantasma: 'text-ink-2 hover:bg-surface-2 hover:text-ink active:bg-line',
}

const tamanhos: Record<TamanhoBotao, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

export function classesBotao(
  variante: VarianteBotao = 'primario',
  tamanho: TamanhoBotao = 'md',
  extra = '',
): string {
  return [base, variantes[variante], tamanhos[tamanho], extra].join(' ')
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
}

export function Botao({ variante, tamanho, className = '', type = 'button', ...props }: BotaoProps) {
  return <button type={type} className={classesBotao(variante, tamanho, className)} {...props} />
}

interface BotaoLinkProps extends LinkProps {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
}

/** Link do React Router com a aparência de botão. */
export function BotaoLink({ variante, tamanho, className = '', ...props }: BotaoLinkProps) {
  return <Link className={classesBotao(variante, tamanho, className)} {...props} />
}
