import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

export type VarianteBotao = 'primario' | 'secundario' | 'fantasma' | 'escuro'
export type TamanhoBotao = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700',
  secundario: 'border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100',
  fantasma: 'text-ink-700 hover:bg-ink-100 active:bg-ink-200',
  escuro: 'bg-ink-900 text-white hover:bg-ink-700',
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
