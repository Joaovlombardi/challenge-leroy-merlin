# Plano da Pessoa 2: telas da loja e do vendedor

Branch: `feat/front-pessoa-2`, com um commit por etapa e merge em `main` ao final.

## Escopo

| Rota | Tela |
| --- | --- |
| `/loja/:lojaId?busca=&chamar=1&produtoId=` | Buscar produto na loja, ver localização e chamar vendedor |
| `/loja/:lojaId/produto/:produtoId` | Detalhe do produto com a rota na planta |
| `/vendedor` | Painel com os chamados da loja |

## Etapas

- [x] **1. Serviço de chamados** (`src/services/chamados.ts`): interface `ChamadosApi` com versão HTTP e simulada. A simulada segue as regras do backend (loja existe, produto é da loja, descrição obrigatória, só `ABERTO` → `EM_ATENDIMENTO` → `CONCLUIDO`, senão 409) e guarda os chamados no `localStorage`, para o chamado aberto como cliente aparecer no painel do vendedor em outra aba.
- [x] **2. Planta esquemática** (`src/lib/planta.ts` + componente `PlantaLoja` em SVG): uma planta única para todas as lojas. Corredores A–F em colunas, trechos 1–5 em cada um, entrada e caixas embaixo. A rota sai da entrada até o trecho do produto. Corredor fora do padrão: planta sem rota, com o texto de corredor e seção.
- [x] **3. Tela da loja**: define a loja atual (vale para QR code), busca pré-preenchida por `?busca=`, lista com preço, estoque e localização, painel de chamar vendedor que abre sozinho com `?chamar=1&produtoId=`. Estados de carregando, erro, vazio e loja inexistente.
- [x] **4. Produto e rota**: dados do produto, corredor e seção, planta com a rota e botão de chamar vendedor.
- [x] **5. Painel do vendedor**: seletor de loja, abas por status com contadores, cartões com descrição, produto, corredor e tempo desde a abertura, botões Atender e Concluir. Atualiza a cada 15 s e tem botão Atualizar.
- [x] **6. Extra: acompanhar o chamado**: o cliente vê o status do chamado que abriu, atualizando sozinho. Simplificação: o acompanhamento dura enquanto o painel está aberto (os ids não são guardados no navegador).
- [x] **7. Acabamento**: revisão no celular, `npm run build`, remover `EmConstrucao`, atualizar o README do frontend e fazer o merge em `main`.

## Combinados com o grupo

- **Pessoa 4:** o `data.sql` deve usar corredores no padrão letra A–F + número 1–5 (como em `src/mocks/dados.ts`), para a planta conseguir traçar a rota. Outros códigos funcionam, mas sem rota desenhada.
- **Sem login no painel do vendedor:** o contrato não prevê autenticação; qualquer pessoa pode abrir `/vendedor`. Aceito para o MVP.
- **Sem tempo real:** o painel consulta o backend periodicamente.
