# Leroy Merlin — referência de identidade visual

Use este arquivo como fonte de verdade de estilo ao construir a interface.
Valores extraídos do tema `leroymerlin` do Mozaic, design system público do grupo ADEO
(`@mozaic-ds/tokens` v2.33.0). Consultado em 2026-11-04.

## Instruções para o Claude Code

1. Use os tokens abaixo como variáveis CSS em `:root`. Não invente cores fora desta lista.
2. Se o projeto usa npm, prefira instalar os tokens oficiais em vez de copiar valores:
   `npm i @mozaic-ds/tokens` → importe `@mozaic-ds/tokens/build/leroymerlin/css/root.css`.
3. Logo: **não desenhe nem recrie o logo** (SVG, CSS ou canvas). Use o arquivo oficial em
   `assets/logo-leroy-merlin.svg` (ou `.png`). Se o arquivo não existir, deixe um placeholder
   cinza com o texto "LOGO" no mesmo tamanho e me avise.
4. A fonte oficial (LeroyMerlin Sans) é proprietária e não está disponível. Use o fallback abaixo,
   a menos que eu forneça os arquivos `.woff2`.
5. Verde é para ação e destaque, não para preencher a tela. Base = branco + preto + cinza-azulado.

## Tokens (CSS)

```css
:root {
  /* Marca e ação */
  --color-brand: #78be20;             /* verde de marca: logo, decorativos, bordas de destaque */
  --color-accent: #117f03;            /* botão principal, links, ícones de destaque */
  --color-accent-hover: #006902;
  --color-accent-border: #3f9e10;
  --color-accent-bg: #ebf5de;         /* fundos de destaque */
  --color-accent-bg-inverse: #035010; /* fundos escuros de marca */

  /* Neutros */
  --color-text-primary: #000000;
  --color-text-secondary: #404040;
  --color-text-tertiary: #666666;
  --color-bg: #ffffff;
  --color-bg-secondary: #eff1f6;      /* cinza-azulado para áreas e cards */
  --color-bg-inverse: #242938;        /* rodapé, áreas escuras */
  --color-neutral-button: #464e63;    /* botão neutro */
  --color-border: #cccccc;

  /* Status: texto / borda / fundo */
  --color-success: #117f03; --color-success-border: #78be20; --color-success-bg: #ebf5de;
  --color-info:    #0074aa; --color-info-border:    #3facd7; --color-info-bg:    #e1f3f9;
  --color-warning: #b64f00; --color-warning-border: #ef934a; --color-warning-bg: #fdf1e8;
  --color-error:   #c61112; --color-error-border:   #ef5f5c; --color-error-bg:   #fdeaea;

  /* Tipografia */
  --font-family: "LeroyMerlin", "Open Sans", "Source Sans 3", Roboto, Arial, sans-serif;
  --line-height: 1.3;       /* 1.5 para blocos longos de texto */

  /* Forma e espaço */
  --radius-s: 4px;          /* botões e campos */
  --radius-m: 8px;          /* cards */
  --radius-l: 16px;
  --space-unit: 8px;        /* escala: 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 */
}
```

## Tipografia

| Estilo | Tamanho | Peso |
| --- | --- | --- |
| Heading L | 32px | 600 |
| Heading M | 28px | 600 |
| Heading S | 24px | 600 |
| Title S | 18px | 600 |
| Body L | 18px | 400 |
| Body M (padrão) | 16px | 400 |
| Body S | 14px | 400 |
| Caption | 12px | 400 |

Texto corrido em 400; títulos e destaques em 600. Sem fontes decorativas ou serifadas.

## Componentes

- **Botão principal:** fundo `--color-accent`, texto branco, raio 4px, hover `--color-accent-hover`.
- **Botão neutro:** fundo `--color-neutral-button`, texto branco.
- **Botão contornado:** fundo branco, borda `--color-brand`, texto `--color-accent`, hover `--color-accent-bg`.
- **Bordas:** 1px (padrão) ou 2px (foco/seleção).
- **Ícones:** estilo outline, tamanhos 16/24/32/48px.
- **Sombras:** suaves, para baixo, opacidade 15–20% (ex.: `0 5px 10px -2px rgb(0 0 0 / .2)`).

## Tom de voz

Casa, família, proximidade e preço acessível. Frases curtas e diretas, em tom caloroso.
O nome da marca aparece em caixa alta: LEROY MERLIN.

## Limites

- Não há manual de marca público: regras de uso do logo e cores de impressão não estão aqui.
- Logo e fonte são propriedade da Leroy Merlin; uso comercial exige autorização da empresa.
