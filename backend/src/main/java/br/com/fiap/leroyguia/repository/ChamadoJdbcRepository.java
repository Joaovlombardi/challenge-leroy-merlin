package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.StatusChamado;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class ChamadoJdbcRepository implements ChamadoRepository {
    private final JdbcClient jdbc;

    public ChamadoJdbcRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Chamado salvar(Chamado chamado) {
        if (chamado.id() == null) {
            KeyHolder chave = new GeneratedKeyHolder();
            jdbc.sql("""
                    INSERT INTO chamado (loja_id, produto_id, descricao, status, criado_em, atualizado_em)
                    VALUES (?, ?, ?, ?, ?, ?)""")
                    .params(chamado.lojaId(), chamado.produtoId(), chamado.descricao(),
                            chamado.status().name(),
                            OffsetDateTime.ofInstant(chamado.criadoEm(), ZoneOffset.UTC),
                            OffsetDateTime.ofInstant(chamado.atualizadoEm(), ZoneOffset.UTC))
                    .update(chave, "id");
            return new Chamado(chave.getKeyAs(Long.class), chamado.lojaId(), chamado.produtoId(),
                    chamado.descricao(), chamado.status(), chamado.criadoEm(), chamado.atualizadoEm());
        }
        jdbc.sql("UPDATE chamado SET status = ?, atualizado_em = ? WHERE id = ?")
                .params(chamado.status().name(),
                        OffsetDateTime.ofInstant(chamado.atualizadoEm(), ZoneOffset.UTC), chamado.id())
                .update();
        return chamado;
    }

    @Override
    public Optional<Chamado> buscarPorId(Long id) {
        return jdbc.sql("SELECT * FROM chamado WHERE id = ?").param(id)
                .query(ChamadoJdbcRepository::paraChamado).optional();
    }

    @Override
    public List<Chamado> listar() {
        return jdbc.sql("SELECT * FROM chamado ORDER BY id")
                .query(ChamadoJdbcRepository::paraChamado).list();
    }

    private static Chamado paraChamado(ResultSet linha, int numero) throws SQLException {
        return new Chamado(linha.getLong("id"), linha.getLong("loja_id"),
                linha.getObject("produto_id", Long.class), linha.getString("descricao"),
                StatusChamado.valueOf(linha.getString("status")),
                linha.getObject("criado_em", OffsetDateTime.class).toInstant(),
                linha.getObject("atualizado_em", OffsetDateTime.class).toInstant());
    }
}
