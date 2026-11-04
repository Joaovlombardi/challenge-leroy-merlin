# Leroy Guia · Frontend

Site do MVP em React 19, TypeScript, Vite e Tailwind CSS 4. Funciona sozinho com dados simulados e, com uma variável de ambiente, passa a usar a API Java em [`../backend`](../backend/README.md).

## Rodar

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # checa os tipos e gera a pasta dist/
npm run preview    # serve a pasta dist/ localmente
```

Precisa de Node 20 ou mais novo.

## Dados simulados ou API real

Copie `.env.example` para `.env` e preencha:

| Variável | Efeito |
| --- | --- |
| `VITE_API_URL` | URL do backend sem barra no final. Em branco, o site usa os dados simulados. |
| `VITE_USE_MOCK` | `true` força os dados simulados mesmo com a URL preenchida. |

O rodapé do site mostra em qual modo ele está. Os dados simulados ficam em `src/mocks/dados.ts` e seguem as mesmas regras de busca do backend (todas as palavras precisam aparecer, sem diferenciar acentos ou maiúsculas; a busca de lojas por produto só considera estoque positivo). A Pessoa 4 pode usar esse arquivo como referência para o `data.sql`.

## Estrutura

```
src/
├── pages/            uma pasta por tela
│   ├── Inicio.tsx            "/"          (Pessoa 1)
│   ├── BuscaLojas.tsx        "/lojas"     (Pessoa 1)
│   ├── Comparador.tsx        "/comparar"  (Pessoa 1)
│   ├── EmConstrucao.tsx      placeholder das telas da Pessoa 2
│   └── NaoEncontrada.tsx     404
├── components/
│   ├── ui/           botões, campos, cartão, selos, esqueletos, estados vazios, ícones
│   ├── layout/       cabeçalho, rodapé, Layout com <Outlet/>, TituloPagina, logotipo
│   ├── catalogo/     formulário de busca, seletor de loja, cartão de loja
│   └── comparador/   seleção de produtos e quadro de comparação
├── services/
│   ├── http.ts       fetch com tratamento do erro {"erro": "..."} do backend
│   └── catalogo.ts   interface CatalogoApi e a escolha entre HTTP e mock
├── mocks/            dados simulados e implementação em memória do catálogo
├── contexts/         LojaAtualContext: loja em que o cliente está
├── hooks/            useCarregar: dados + carregando + erro + recarregar
├── lib/              texto (normalizar, formatar preço), comparação, localStorage
├── types/api.ts      tipos espelhando o contrato do backend
├── App.tsx           mapa de rotas
└── index.css         tema (cores, fontes, sombras) do Tailwind
```

## Rotas e quem faz cada uma

| Rota | Tela | Responsável |
| --- | --- | --- |
| `/` | Tela inicial: "estou em casa" (cidade + produto) e "estou na loja" (escolher loja) | Pessoa 1 |
| `/lojas?cidade=&produto=` | Lojas com o produto em estoque, menor preço e opções por loja | Pessoa 1 |
| `/comparar?lojaId=&busca=&ids=` | Até 4 produtos de uma loja lado a lado | Pessoa 1 |
| `/loja/:lojaId?busca=&chamar=1&produtoId=` | Tela da loja: buscar produto, ver rota na planta, chamar vendedor | Pessoa 2 |
| `/loja/:lojaId/produto/:produtoId` | Detalhe do produto com corredor, seção e traçado na planta | Pessoa 2 |
| `/vendedor` | Painel do vendedor com os chamados | Pessoa 2 |

As rotas da Pessoa 2 já existem em `App.tsx` apontando para a página `EmConstrucao`, que mostra os parâmetros recebidos. Para assumir uma rota, basta trocar o `element` pela tela nova.

### O que as telas da Pessoa 1 enviam para as da Pessoa 2

- **Ver na loja** (busca e comparador): `/loja/{lojaId}?busca={termo}`. O termo é o que o cliente digitou; a tela da loja pode abrir já com ele preenchido.
- **Ir até a prateleira** (comparador): `/loja/{lojaId}/produto/{produtoId}`.
- **Chamar vendedor** (comparador): `/loja/{lojaId}?chamar=1&produtoId={produtoId}`. A ideia é abrir o formulário de chamado com o produto já selecionado.
- **Escolher loja** (tela inicial): salva a loja em `localStorage` na chave `leroy-guia:loja-atual` e navega para `/loja/{lojaId}`. Para ler, use o hook `useLojaAtual()` de `src/contexts/LojaAtualContext.tsx`.
- **QR code na entrada** (extra do documento da sprint): o QR pode apontar direto para `/loja/{lojaId}`. Vale a tela da loja chamar `definirLojaAtual(loja)` ao abrir, assim o cabeçalho passa a mostrar "Você está na Loja X".

### Peças prontas para reutilizar

Tudo em `src/components/ui` é exportado por `src/components/ui/index.ts`:

```tsx
import { Botao, BotaoLink, Campo, Seletor, Cartao, Selo, SeloEstoque, EstadoVazio, AlertaErro, Esqueleto, Icone } from '@/components/ui'

<Botao variante="primario" tamanho="lg">Buscar</Botao>
<BotaoLink to="/lojas" variante="secundario">Ver lojas</BotaoLink>
<SeloEstoque estoque={produto.estoque} />
<AlertaErro mensagem={erro} aoTentarDeNovo={recarregar} />
```

Para carregar dados em uma tela:

```tsx
const produtos = useCarregar(() => catalogo.listarProdutos(lojaId, busca), [lojaId, busca])
// produtos.dados, produtos.carregando, produtos.erro, produtos.recarregar()
```

Para os chamados (`POST /api/chamados`, `GET /api/chamados`, `PATCH /api/chamados/{id}/status`), os tipos já estão em `src/types/api.ts`. Falta só um `services/chamados.ts` no mesmo estilo de `services/catalogo.ts`, com uma versão HTTP e uma simulada.

## Identidade visual

O tema fica em `src/index.css`. O verde principal `brand-500` (#78be20) é o verde da Leroy Merlin; os outros tons derivam dele. `ink` é a escala de cinzas usada em texto e bordas, `alert` o laranja de aviso (sem estoque) e `sun` o amarelo de destaque (últimas unidades, melhor avaliado). A fonte é a Inter. Botões são arredondados, cartões têm cantos de 1rem e sombra leve. O site é feito primeiro para celular, que é como o cliente usa dentro da loja.

## Campos opcionais no contrato

`Loja.endereco`, `Produto.marca`, `Produto.avaliacao` e `Produto.imagemUrl` **não existem no contrato do backend**. Eles estão como opcionais em `src/types/api.ts` e nos dados simulados. Se as pessoas 3 e 4 resolverem adicioná-los, as telas passam a mostrá-los sem mudança no front. Se não, nada quebra: o comparador deixa de mostrar as linhas de marca e avaliação, e o cartão de loja mostra só a cidade.

## Deploy na Vercel (Pessoa 5)

1. Importar o repositório na Vercel e definir **Root Directory** como `frontend`. Framework: Vite. Build: `npm run build`. Output: `dist`.
2. Em *Environment Variables*, definir `VITE_API_URL` com a URL do backend no Render e `VITE_USE_MOCK` como `false`. Enquanto o backend não estiver no ar, deixar `VITE_USE_MOCK=true` para o site funcionar com os dados simulados.
3. O arquivo `vercel.json` já redireciona todas as rotas para `index.html`, necessário para links diretos como `/lojas?produto=tinta` funcionarem.
4. No Render, definir `APP_CORS_ALLOWED_ORIGINS` com a URL do site na Vercel (ver o README do backend).

O plano gratuito do Render coloca o backend para dormir. A primeira chamada pode levar vários segundos; o site mostra um esqueleto de carregamento e, se falhar, uma mensagem com botão de tentar de novo.
