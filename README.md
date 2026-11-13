# Leroy Guia

MVP do desafio Leroy Merlin da FIAP: o cliente encontra uma loja com estoque, localiza o produto na planta e chama um vendedor. O frontend React está em [`frontend/`](frontend/README.md); a API Java com H2 está em [`backend/`](backend/README.md).

## Rodar localmente

1. Em `backend/`, com JDK 21 ou superior: `./mvnw spring-boot:run` (Windows: `.\mvnw.cmd spring-boot:run`). A API atende em `http://localhost:8080`.
2. Em `frontend/`: `npm ci`; configure `VITE_API_URL=http://localhost:8080` e `VITE_USE_MOCK=false` em `.env.local`; rode `npm run dev`.
3. Abra `http://localhost:5173` e teste a busca de lojas, o produto e o painel `/vendedor`.

O catálogo de exemplo é definido em `frontend/src/mocks/dados.ts`. Rode `npm run export:sql` em `frontend/` após alterá-lo. O banco H2 é recriado a cada início da API, inclusive os chamados.

## Verificação e publicação

`npm run check:sql` e `npm run build` em `frontend/`; `./mvnw verify` em `backend/`. O CI executa essas verificações. O `render.yaml` e `backend/Dockerfile` preparam o backend para o Render; o frontend usa Vercel com diretório raiz `frontend`. As variáveis de conexão e CORS estão no [guia de integração e deploy](backend/docs/guia-do-backend.md).
