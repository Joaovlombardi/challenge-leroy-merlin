package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class CatalogoJdbcRepository implements CatalogoRepository {
    private final JdbcClient jdbc;

    public CatalogoJdbcRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Loja> listarLojas() {
        return jdbc.sql("SELECT id, nome, cidade, endereco FROM loja ORDER BY id")
                .query((linha, numero) -> new Loja(linha.getLong("id"), linha.getString("nome"),
                        linha.getString("cidade"), linha.getString("endereco")))
                .list();
    }

    @Override
    public List<Produto> listarProdutos(Long lojaId) {
        return jdbc.sql("SELECT * FROM produto WHERE loja_id = ? ORDER BY id")
                .param(lojaId)
                .query((linha, numero) -> new Produto(
                        linha.getLong("id"), linha.getLong("loja_id"), linha.getString("nome"),
                        linha.getString("descricao"), linha.getBigDecimal("preco"),
                        linha.getInt("estoque"), linha.getString("corredor"),
                        linha.getString("secao"), linha.getString("marca"),
                        linha.getBigDecimal("avaliacao"), linha.getString("imagem_url")))
                .list();
    }
}
