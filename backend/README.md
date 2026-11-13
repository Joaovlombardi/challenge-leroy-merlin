# API do Leroy Guia

Backend Java 21 com Spring Boot 4.1.2. A API usa H2 em memória, carrega as mesmas 4 lojas e 86 produtos do frontend e guarda os chamados enquanto o processo estiver ativo. O arquivo `data.sql` é gerado a partir de `frontend/src/mocks/dados.ts`; alterações no catálogo devem começar no frontend e ser exportadas com `npm run export:sql` na pasta `frontend`.

Para executar localmente: `./mvnw spring-boot:run` (Linux/macOS) ou `.\mvnw.cmd spring-boot:run` (Windows). A API atende em `http://localhost:8080`. O [guia do backend](docs/guia-do-backend.md) resume a integração e o deploy.

## Executar os testes

Na pasta `backend`, execute `./mvnw test` (Linux/macOS) ou `.\mvnw.cmd test` (Windows). É necessário JDK 21 ou superior. O Maven Wrapper baixa o Maven automaticamente na primeira execução.

## Contrato HTTP

Todos os endpoints usam JSON e o prefixo `/api`. Os IDs são números inteiros positivos. `preco` é um número em reais; `criadoEm` e `atualizadoEm` são instantes ISO 8601 em UTC. Erros de validação retornam HTTP 400; recursos inexistentes retornam 404; transições de status inválidas retornam 409. Respostas de erro tratadas têm o formato `{"erro":"mensagem"}`.

### Lojas e produtos

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/api/lojas?cidade=sao&produto=tinta` | Lista lojas; filtros opcionais, sem diferenciar maiúsculas ou acentos. O filtro de produto retorna somente lojas com estoque positivo de um item correspondente. |
| GET | `/api/lojas/{lojaId}/produtos?busca=tinta parede` | Lista produtos da loja; a busca opcional exige que todas as palavras apareçam no nome ou descrição. Inclui produtos sem estoque para permitir comparação. |
| GET | `/api/lojas/{lojaId}/produtos/{produtoId}` | Detalhes de um produto naquela loja. |

Exemplo de loja:

```json
{"id":1,"nome":"Loja Morumbi","cidade":"São Paulo","endereco":"Av. das Nações Unidas, 4500"}
```

Exemplo de produto:

```json
{"id":101,"lojaId":1,"nome":"Tinta acrílica fosca branca 18L","descricao":"Tinta para parede interna e externa, acabamento fosco, rende até 300 m². Linha econômica.","preco":189.90,"estoque":12,"corredor":"A2","secao":"Tintas","marca":"Colorlar","avaliacao":4.0}
```

As rotas de listagem retornam arrays desses objetos. A tela pode comparar preço e estoque dos produtos recebidos e mostrar corredor e seção como destino; o traçado visual da rota na planta cabe ao frontend.

### Chamados de vendedor

| Método | Rota | Uso |
| --- | --- | --- |
| POST | `/api/chamados` | Abre um chamado; retorna HTTP 201, objeto criado e cabeçalho `Location: /api/chamados/{id}`. |
| GET | `/api/chamados?lojaId=1&status=ABERTO` | Lista chamados; ambos os filtros são opcionais. |
| PATCH | `/api/chamados/{id}/status` | Avança o status de um chamado. |

Exemplo de criação (o produto é opcional, a descrição não):

```json
{"lojaId":1,"produtoId":101,"descricao":"Preciso de ajuda com esta tinta"}
```

Exemplo de resposta:

```json
{"id":1,"lojaId":1,"produtoId":101,"descricao":"Preciso de ajuda com esta tinta","status":"ABERTO","criadoEm":"2026-11-13T12:00:00Z","atualizadoEm":"2026-11-13T12:00:00Z"}
```

Exemplo de atualização:

```json
{"status":"EM_ATENDIMENTO"}
```

Os únicos avanços permitidos são `ABERTO` → `EM_ATENDIMENTO` → `CONCLUIDO`. O chamado deve citar uma loja existente e, quando informado, um produto pertencente a essa loja.

## Deploy

O `Dockerfile` em `backend/` e o `render.yaml` na raiz preparam um serviço web gratuito no Render. Configure `APP_CORS_ALLOWED_ORIGINS` com a origem exata da Vercel, sem barra final. O padrão local permite `http://localhost:5173` e `http://localhost:3000`. A aplicação usa a variável `PORT` fornecida pelo Render.

O H2 fica em memória: chamados se perdem quando o serviço reinicia ou dorme. Isso atende ao MVP demonstrativo; se os chamados precisarem sobreviver a reinícios, será necessário trocar por um banco persistente.
