# Guia do backend

A API do Leroy Guia já sobe com H2, as 4 lojas e os 86 produtos do frontend. As rotas estão em [README](../README.md). O catálogo do front em `frontend/src/mocks/dados.ts` é a fonte da verdade para os dados de exemplo.

## Desenvolvimento local

1. Na pasta `frontend`, rode `npm ci`, `npm run check:sql` e `npm run build`. Ao alterar lojas ou produtos, rode `npm run export:sql` para atualizar o seed do H2.
2. Na pasta `backend`, use JDK 21 ou superior e rode `./mvnw verify` (Windows: `.\mvnw.cmd verify`).
3. Inicie o backend com `./mvnw spring-boot:run`.
4. Inicie o frontend com `VITE_API_URL=http://localhost:8080` e `VITE_USE_MOCK=false`. A tela deve mostrar o modo de API real.
5. Busque uma loja por produto, abra o detalhe, registre um chamado e avance seu status no painel do vendedor.

O H2 é criado por `schema.sql` e preenchido por `data.sql` a cada inicialização. Os chamados ficam em memória e desaparecem quando o backend reinicia.

## Deploy

O site e a API estão publicados em `https://leroy-guia-fiap.vercel.app` e `https://leroy-guia-api.onrender.com`. A produção da Vercel usa `VITE_API_URL=https://leroy-guia-api.onrender.com` e `VITE_USE_MOCK=false`. O Render permite a origem do site por `APP_CORS_ALLOWED_ORIGINS`.

O `backend/Dockerfile` monta o pacote Java e o `render.yaml` configura um serviço web gratuito no Render. O serviço lê `PORT` e precisa de `APP_CORS_ALLOWED_ORIGINS` com a origem exata do site Vercel.

Na Vercel, use `frontend` como diretório raiz, `npm run build` como build e `dist` como saída. Defina `VITE_API_URL` com a URL pública do Render e `VITE_USE_MOCK=false`. Refaça o deploy após configurar essas variáveis, pois o Vite incorpora a URL no build.

Antes da apresentação, acesse a API e confirme `GET /api/lojas`, `GET /api/lojas/1/produtos/101`, `POST /api/chamados` e `PATCH /api/chamados/{id}/status`. Verifique também a busca e o painel no site publicado.
