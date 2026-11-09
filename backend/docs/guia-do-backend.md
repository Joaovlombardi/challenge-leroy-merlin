# Guia do backend: o que falta e como construir

Este guia é para todo o grupo. Ele explica, sem pressa, como o backend do Leroy Guia está montado, o que ainda falta para ele funcionar de verdade e uma ordem sugerida para fazer isso, em fases pequenas.

> **Resumo em uma frase:** as rotas e as regras já estão prontas; falta **guardar os dados em um banco** (H2) e **publicar** a API para o site usar.

---

## 1. Como o backend está organizado

Uma requisição passa por três camadas, sempre nesta ordem:

```
Site (React)
   │  GET /api/lojas?produto=tinta
   ▼
Controller   → recebe a requisição HTTP e devolve JSON          ✅ pronto
   ▼
Service      → aplica as regras (filtros, validações, status)   ✅ pronto
   ▼
Repository   → lê e grava os dados no banco                     ❌ falta implementar
   ▼
Banco H2     → onde os dados ficam                              ❌ falta criar
```

| Pasta (`src/main/java/br/com/fiap/leroyguia/`) | O que tem | Situação |
| --- | --- | --- |
| `controller/` | As 6 rotas da API e o tratamento de erros | ✅ Pronto |
| `service/` | Regras de busca, de chamados e de status | ✅ Pronto |
| `model/` | `Loja`, `Produto`, `Chamado`, `StatusChamado` | ✅ Pronto |
| `repository/` | **Só as interfaces** `CatalogoRepository` e `ChamadoRepository` | ❌ Falta a implementação |
| `config/` | Liberação de CORS para o site | ✅ Pronto |

### Por que a aplicação não sobe hoje?

Os services pedem um `CatalogoRepository` e um `ChamadoRepository` no construtor. Como ninguém implementou essas interfaces ainda, o Spring não tem o que entregar e para na inicialização. **Implementar os dois repositórios é o que destrava tudo.**

### Uma boa notícia

As regras (busca sem acento, filtro por estoque, só avançar `ABERTO → EM_ATENDIMENTO → CONCLUIDO`, erros 400/404/409) **já estão nos services**. O repositório só precisa **ler e gravar**, sem repetir nenhuma regra.

---

## 2. O que o site espera da API

O frontend já está pronto e hoje funciona com dados simulados. Quando o backend estiver no ar, ele passa a chamar estas rotas:

| Rota | Quem usa no site |
| --- | --- |
| `GET /api/lojas?cidade=&produto=` | Tela inicial e busca de lojas |
| `GET /api/lojas/{lojaId}/produtos?busca=` | Comparador, tela da loja e painel do vendedor |
| `GET /api/lojas/{lojaId}/produtos/{produtoId}` | Tela do produto (com a planta) |
| `POST /api/chamados` | Botão "Chamar vendedor" |
| `GET /api/chamados?lojaId=&status=` | Painel do vendedor e acompanhamento do chamado pelo cliente |
| `PATCH /api/chamados/{id}/status` | Botões "Atender" e "Concluir" |

O formato de cada resposta está no [README do backend](../README.md). Erros sempre voltam como `{"erro": "mensagem"}`.

### Três combinados com o frontend

1. **Corredor no padrão letra + número.** A planta da loja no site entende corredores de **A a F** com trechos de **1 a 5** (ex.: `A2`, `C4`, `F3`). Um código fora disso (ex.: `Z9`) funciona, mas a planta aparece sem a rota desenhada.
2. **Mesmos dados do site.** Os dados simulados do site estão em `frontend/src/mocks/dados.ts` (4 lojas e o estoque de cada uma). Usar os mesmos dados no banco faz o site se comportar igual com e sem backend, o que facilita testar e apresentar.
3. **Chamados "ao vivo".** O painel do vendedor consulta `GET /api/chamados` a cada 15 segundos, e a tela do cliente a cada 10. Não é preciso nada em tempo real (WebSocket etc.).

---

## 3. Lista de necessidades

É tudo o que falta, do obrigatório ao opcional:

| # | Necessidade | Obrigatória? |
| --- | --- | --- |
| N1 | Dar permissão de execução ao `mvnw` e ter o JDK 21 | Sim |
| N2 | Adicionar as dependências do H2 e do JDBC no `pom.xml` | Sim |
| N3 | Criar as tabelas (`schema.sql`) | Sim |
| N4 | Inserir os dados de exemplo (`data.sql`) | Sim |
| N5 | Implementar `CatalogoRepository` | Sim |
| N6 | Implementar `ChamadoRepository` | Sim |
| N7 | Ajustar o `application.properties` (porta e banco) | Sim |
| N8 | Testar a API junto com o site, localmente | Sim |
| N9 | Publicar no Render (com Dockerfile) e ligar o site da Vercel | Sim |
| N10 | Campos extras: `endereco`, `marca`, `avaliacao` | Opcional |
| N11 | Rota `GET /api/chamados/{id}` | Opcional |

---

## 4. Implementação em fases

Cada fase termina com algo que **dá para ver funcionando**. Só passe para a próxima quando o "pronto quando" da fase atual estiver ok.

### Fase 0: preparar o ambiente (N1)

**Objetivo:** todo mundo consegue rodar os testes do backend.

1. Instale o **JDK 21** ou superior e confira com `java -version`. O JDK 17 não serve: o `pom.xml` pede Java 21.
2. O arquivo `mvnw` foi para o Git **sem permissão de execução**, e por isso `./mvnw` dá "permission denied" no Linux/Mac e no Render. Corrija uma vez só e faça o commit:
   ```bash
   git update-index --chmod=+x backend/mvnw
   ```
3. Rode `./mvnw test` dentro de `backend/`.

**Pronto quando:** os 4 testes passarem.

---

### Fase 1: banco e dados (N2, N3, N4)

**Objetivo:** ter o banco H2 criado com as tabelas e os dados de exemplo.

> **O que é o H2?** É um banco de dados que roda **dentro** da aplicação Java, na memória. Não precisa instalar nada. A cada vez que a aplicação inicia, o Spring cria as tabelas (`schema.sql`) e insere os dados (`data.sql`) sozinho.

**1. Dependências:** acrescente no `pom.xml`, dentro de `<dependencies>`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

**2. Tabelas:** crie `src/main/resources/schema.sql`. Cada tabela espelha um `record` da pasta `model/`:

```sql
CREATE TABLE loja (
    id     BIGINT PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL
);

CREATE TABLE produto (
    id        BIGINT PRIMARY KEY,
    loja_id   BIGINT NOT NULL REFERENCES loja (id),
    nome      VARCHAR(150) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    preco     DECIMAL(10, 2) NOT NULL,
    estoque   INT NOT NULL,
    corredor  VARCHAR(10) NOT NULL,  -- padrão A1 a F5 (ver seção 2)
    secao     VARCHAR(100) NOT NULL
);

-- O id do chamado é gerado pelo banco (1, 2, 3...).
CREATE TABLE chamado (
    id            BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    loja_id       BIGINT NOT NULL REFERENCES loja (id),
    produto_id    BIGINT REFERENCES produto (id),  -- pode ficar vazio (chamado sem produto)
    descricao     VARCHAR(500) NOT NULL,
    status        VARCHAR(20) NOT NULL,            -- ABERTO, EM_ATENDIMENTO ou CONCLUIDO
    criado_em     TIMESTAMP NOT NULL,
    atualizado_em TIMESTAMP NOT NULL
);
```

**3. Dados:** crie `src/main/resources/data.sql`, com os mesmos dados de `frontend/src/mocks/dados.ts`. Os IDs dos produtos seguem a regra do site: **`lojaId × 100 + posição`** (a Loja 1 tem os produtos 101, 102, 103…). Exemplo das primeiras linhas:

```sql
INSERT INTO loja (id, nome, cidade) VALUES
    (1, 'Loja Morumbi',  'São Paulo'),
    (2, 'Loja Tietê',    'São Paulo'),
    (3, 'Loja Campinas', 'Campinas'),
    (4, 'Loja Curitiba', 'Curitiba');

INSERT INTO produto (id, loja_id, nome, descricao, preco, estoque, corredor, secao) VALUES
    (101, 1, 'Tinta acrílica fosca branca 18L',
     'Tinta para parede interna e externa, acabamento fosco, rende até 300 m². Linha econômica.',
     189.90, 12, 'A2', 'Tintas'),
    (102, 1, 'Tinta acrílica premium branca 18L',
     'Tinta lavável para parede, acabamento fosco aveludado, rende até 350 m². Alta cobertura, menos demãos.',
     329.90, 6, 'A2', 'Tintas');
    -- ... continua com os demais produtos de cada loja
```

> Não é preciso inserir chamados: eles nascem quando o cliente clica em "Chamar vendedor".

**Pronto quando:** as três tabelas e os dados estiverem nos arquivos. A aplicação ainda não sobe, porque falta a Fase 2.

---

### Fase 2: repositórios (N5, N6, N7). É a fase principal.

**Objetivo:** implementar as duas interfaces. Com isso, **a aplicação sobe e a API responde**.

Vamos usar o **`JdbcClient`** do Spring: você escreve o SQL e diz como transformar cada linha do resultado em um objeto Java. Não tem mágica escondida, e combina com os `record`s que já existem.

> **Por que não JPA/Hibernate?** Os modelos são `record`s, e o JPA não trabalha com `record`s como entidades. Ele também esconderia o SQL, que é justamente o que queremos aprender e mostrar aqui.

**1. `src/main/java/br/com/fiap/leroyguia/repository/CatalogoJdbcRepository.java`**

```java
package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Lê lojas e produtos do banco H2. As regras de busca ficam no CatalogoService. */
@Repository
public class CatalogoJdbcRepository implements CatalogoRepository {
    private final JdbcClient jdbc;

    public CatalogoJdbcRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Loja> listarLojas() {
        return jdbc.sql("SELECT id, nome, cidade FROM loja ORDER BY id")
                .query((linha, numero) -> new Loja(
                        linha.getLong("id"),
                        linha.getString("nome"),
                        linha.getString("cidade")))
                .list();
    }

    @Override
    public List<Produto> listarProdutos(Long lojaId) {
        return jdbc.sql("SELECT * FROM produto WHERE loja_id = ? ORDER BY id")
                .param(lojaId)
                .query((linha, numero) -> new Produto(
                        linha.getLong("id"),
                        linha.getLong("loja_id"),
                        linha.getString("nome"),
                        linha.getString("descricao"),
                        linha.getBigDecimal("preco"),
                        linha.getInt("estoque"),
                        linha.getString("corredor"),
                        linha.getString("secao")))
                .list();
    }
}
```

**2. `src/main/java/br/com/fiap/leroyguia/repository/ChamadoJdbcRepository.java`**

A regra do `salvar` está no comentário da interface: **sem id = chamado novo (INSERT)**; **com id = chamado existente (UPDATE)**.

```java
package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.StatusChamado;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

/** Grava e lê chamados no banco H2. As regras de status ficam no ChamadoService. */
@Repository
public class ChamadoJdbcRepository implements ChamadoRepository {
    private final JdbcClient jdbc;

    public ChamadoJdbcRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Chamado salvar(Chamado chamado) {
        if (chamado.id() == null) {
            // Chamado novo: o banco gera o id e nós o lemos de volta.
            KeyHolder idGerado = new GeneratedKeyHolder();
            jdbc.sql("""
                    INSERT INTO chamado (loja_id, produto_id, descricao, status, criado_em, atualizado_em)
                    VALUES (?, ?, ?, ?, ?, ?)""")
                    .params(chamado.lojaId(), chamado.produtoId(), chamado.descricao(),
                            chamado.status().name(),
                            Timestamp.from(chamado.criadoEm()), Timestamp.from(chamado.atualizadoEm()))
                    .update(idGerado, "id");
            Long id = idGerado.getKeyAs(Long.class);
            return new Chamado(id, chamado.lojaId(), chamado.produtoId(), chamado.descricao(),
                    chamado.status(), chamado.criadoEm(), chamado.atualizadoEm());
        }

        // Chamado existente: só o status e a data de atualização mudam.
        jdbc.sql("UPDATE chamado SET status = ?, atualizado_em = ? WHERE id = ?")
                .params(chamado.status().name(), Timestamp.from(chamado.atualizadoEm()), chamado.id())
                .update();
        return chamado;
    }

    @Override
    public Optional<Chamado> buscarPorId(Long id) {
        return jdbc.sql("SELECT * FROM chamado WHERE id = ?")
                .param(id)
                .query(ChamadoJdbcRepository::paraChamado)
                .optional();
    }

    @Override
    public List<Chamado> listar() {
        return jdbc.sql("SELECT * FROM chamado ORDER BY id")
                .query(ChamadoJdbcRepository::paraChamado)
                .list();
    }

    /** Transforma uma linha da tabela "chamado" em um objeto Chamado. */
    private static Chamado paraChamado(ResultSet linha, int numero) throws SQLException {
        return new Chamado(
                linha.getLong("id"),
                linha.getLong("loja_id"),
                linha.getObject("produto_id", Long.class),  // getObject devolve null quando está vazio
                linha.getString("descricao"),
                StatusChamado.valueOf(linha.getString("status")),
                linha.getTimestamp("criado_em").toInstant(),
                linha.getTimestamp("atualizado_em").toInstant());
    }
}
```

**3. `src/main/resources/application.properties`**

```properties
spring.application.name=leroy-guia-api

# O Render informa a porta pela variável PORT; no computador, usa 8080.
server.port=${PORT:8080}

# Banco H2 em memória. Os scripts schema.sql e data.sql rodam a cada inicialização.
spring.datasource.url=jdbc:h2:mem:leroyguia
spring.sql.init.mode=always

# Origens que podem chamar a API (o site). No Render, defina APP_CORS_ALLOWED_ORIGINS.
app.cors.allowed-origins=${APP_CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

**4. Teste rápido** (com a aplicação rodando via `./mvnw spring-boot:run`):

```bash
curl "http://localhost:8080/api/lojas?produto=tinta"
curl "http://localhost:8080/api/lojas/1/produtos/101"
curl -X POST http://localhost:8080/api/chamados \
     -H "Content-Type: application/json" \
     -d '{"lojaId":1,"produtoId":101,"descricao":"Preciso de ajuda"}'
curl -X PATCH http://localhost:8080/api/chamados/1/status \
     -H "Content-Type: application/json" -d '{"status":"EM_ATENDIMENTO"}'
```

**Pronto quando:**
- a aplicação sobe sem erro;
- os quatro `curl` respondem como no README do backend;
- os 4 testes antigos continuam passando. Eles não usam o banco, então não são afetados.

> **Sugestão de teste novo:** um teste com `@SpringBootTest` que só verifica se a aplicação inicia. Ele avisa na hora se alguém quebrar o `schema.sql`, o `data.sql` ou um repositório.

---

### Fase 3: ligar o site no backend local (N8)

**Objetivo:** usar o site de verdade contra a API rodando no seu computador.

1. Deixe o backend rodando (`./mvnw spring-boot:run`).
2. Em `frontend/`, crie um arquivo `.env` com:
   ```
   VITE_API_URL=http://localhost:8080
   VITE_USE_MOCK=false
   ```
3. Rode `npm run dev` e abra http://localhost:5173. O rodapé do site deixa de dizer "Dados simulados".
4. Faça o roteiro completo:
   - buscar "tinta" na tela inicial;
   - comparar produtos;
   - abrir a tela da loja e ver a planta de um produto;
   - chamar um vendedor;
   - em outra aba, abrir `/vendedor`, atender e concluir;
   - na primeira aba, ver o status mudar em até 10 segundos.

**Pronto quando:** o roteiro inteiro funcionar sem nenhum erro na tela.

---

### Fase 4: publicar (N9)

**Objetivo:** API no Render e site na Vercel, conversando entre si.

**1. `backend/Dockerfile`.** O Render não roda Java direto, então ele usa Docker:

```dockerfile
# Etapa 1: compila o projeto e gera o .jar
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

# Etapa 2: imagem pequena, só com o Java para rodar o .jar
FROM eclipse-temurin:21-jre
COPY --from=build /app/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
```

**2. No Render:**
- crie um *Web Service* a partir do repositório;
- use **Root Directory** `backend` e **Runtime** Docker;
- em *Environment*, defina `APP_CORS_ALLOWED_ORIGINS` com a URL do site na Vercel (ex.: `https://leroy-guia.vercel.app`, sem barra no final).

**3. Na Vercel:** defina `VITE_API_URL` com a URL do Render e `VITE_USE_MOCK=false`. Os detalhes estão no [README do frontend](../../frontend/README.md).

**Pronto quando:** o roteiro da Fase 3 funcionar pelos endereços públicos.

> **Limitação conhecida:** no plano gratuito, o Render "dorme" depois de um tempo sem uso. Como o H2 fica na memória, os **chamados somem** quando ele dorme; as lojas e os produtos voltam sozinhos pelo `data.sql`. Para a apresentação, abra o site alguns minutos antes, para "acordar" a API.

---

### Fase 5: melhorias opcionais (N10, N11)

Faça só se sobrar tempo. O site **já está preparado** e não precisa de nenhuma mudança para aproveitá-las.

| Melhoria | O que fazer no backend | O que muda no site |
| --- | --- | --- |
| Endereço da loja | Coluna `endereco` em `loja` e campo no `record Loja` | Mostra o endereço nos cartões de loja |
| Marca e avaliação | Colunas `marca` e `avaliacao` em `produto` e campos no `record Produto` | Mostra a marca e as estrelas nos produtos e no comparador |
| `GET /api/chamados/{id}` | Nova rota no `ChamadoController` usando `buscarPorId` | Hoje o site lista todos os chamados da loja para achar um; com a rota, poderia buscar só o dele |

Os valores de `endereco`, `marca` e `avaliacao` também estão em `frontend/src/mocks/dados.ts`.

---

## 5. Resumo das fases

| Fase | Entrega | Resultado visível |
| --- | --- | --- |
| 0 | JDK 21 + `mvnw` executável | `./mvnw test` passa |
| 1 | `pom.xml`, `schema.sql`, `data.sql` | Banco descrito nos arquivos |
| 2 | Dois repositórios + `application.properties` | API responde no `curl` |
| 3 | Site apontando para `localhost:8080` | Roteiro completo funcionando no computador |
| 4 | `Dockerfile`, Render e Vercel | Roteiro completo funcionando na internet |
| 5 | Campos extras e rota nova | Mais informação nas telas |

## 6. Glossário rápido

- **Controller:** a "porta de entrada" da API; transforma HTTP em chamadas Java e as respostas em JSON.
- **Service:** onde ficam as regras de negócio.
- **Repository:** a camada que conversa com o banco.
- **Bean:** um objeto que o Spring cria e entrega para quem precisa. Quem tem `@Repository`, `@Service` ou `@RestController` vira bean.
- **H2:** banco de dados que roda dentro da aplicação, na memória.
- **JdbcClient:** classe do Spring para executar SQL e transformar as linhas do resultado em objetos.
- **CORS:** regra do navegador que só deixa o site chamar a API se a API autorizar a origem do site.
- **Render / Vercel:** serviços que hospedam, respectivamente, a API (backend) e o site (frontend).
