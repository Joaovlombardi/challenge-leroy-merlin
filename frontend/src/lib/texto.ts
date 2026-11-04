/** Remove acentos, baixa a caixa e apara espaços (mesma regra do backend). */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

/**
 * Mesma regra de busca do backend: todas as palavras da busca precisam
 * aparecer no texto, sem diferenciar maiúsculas ou acentos.
 */
export function correspondeBusca(texto: string, busca?: string | null): boolean {
  if (!busca || !busca.trim()) return true
  const alvo = normalizar(texto)
  return normalizar(busca)
    .split(/\s+/)
    .every((palavra) => alvo.includes(palavra))
}

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarPreco(valor: number): string {
  return formatoMoeda.format(valor)
}

export function plural(quantidade: number, singular: string, pluralTexto: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : pluralTexto}`
}

/** Deixa a primeira letra maiúscula. */
export function capitalizar(texto: string): string {
  return texto ? texto[0].toUpperCase() + texto.slice(1) : texto
}
