# API do Leroy Guia

Backend Java 21 com Spring Boot 4.1.2. Esta entrega define as rotas, os modelos, as regras dos chamados e as interfaces de persistência. **Ainda não há implementação das interfaces nem dados H2**: a aplicação só inicia para atender requisições depois que a pessoa 4 fornecer beans para `CatalogoRepository` e `ChamadoRepository`. Os testes usam implementações apenas de teste.

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
{"id":1,"nome":"Loja São Paulo","cidade":"São Paulo"}
```

Exemplo de produto:

```json
{"id":10,"lojaId":1,"nome":"Tinta branca","descricao":"Tinta acrílica para parede","preco":49.90,"estoque":4,"corredor":"A2","secao":"Tintas"}
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
{"lojaId":1,"produtoId":10,"descricao":"Preciso de ajuda com esta tinta"}
```

Exemplo de resposta:

```json
{"id":1,"lojaId":1,"produtoId":10,"descricao":"Preciso de ajuda com esta tinta","status":"ABERTO","criadoEm":"2026-11-04T12:00:00Z","atualizadoEm":"2026-11-04T12:00:00Z"}
```

Exemplo de atualização:

```json
{"status":"EM_ATENDIMENTO"}
```

Os únicos avanços permitidos são `ABERTO` → `EM_ATENDIMENTO` → `CONCLUIDO`. O chamado deve citar uma loja existente e, quando informado, um produto pertencente a essa loja.

## Integração com a pessoa 4

Implementar `CatalogoRepository` e `ChamadoRepository` como beans Spring, usando H2 e os dados de exemplo. `CatalogoRepository.listarLojas()` devolve as lojas; `listarProdutos(lojaId)` devolve os produtos daquela loja com preço, estoque e localização. `ChamadoRepository.salvar()` atribui um ID a chamados novos e atualiza os existentes; `buscarPorId()` e `listar()` fornecem os dados para a tela do vendedor. Os serviços aplicam filtros e transições, portanto a implementação do banco não precisa repetir essas regras.

Para liberar o acesso do frontend hospedado, definir `APP_CORS_ALLOWED_ORIGINS` com a origem da Vercel, por exemplo `https://seu-site.vercel.app`. O padrão local permite `http://localhost:5173` e `http://localhost:3000`.
