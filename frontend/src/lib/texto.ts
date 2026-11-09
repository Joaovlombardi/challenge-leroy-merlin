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

/** Tempo desde um instante ISO, em texto curto: "agora mesmo", "há 5 min", "há 2 h". */
export function tempoDesde(instante: string): string {
  const minutos = Math.floor((Date.now() - new Date(instante).getTime()) / 60000)
  if (minutos < 1) return 'agora mesmo'
  if (minutos < 60) return `há ${minutos} min`
  return `há ${Math.floor(minutos / 60)} h`
}

/** Deixa a primeira letra maiúscula. */
export function capitalizar(texto: string): string {
  return texto ? texto[0].toUpperCase() + texto.slice(1) : texto
}
