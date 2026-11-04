package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Chamado;
import java.util.List;
import java.util.Optional;

/** salvar atribui um ID quando o chamado é novo e atualiza quando ele já existe. */
public interface ChamadoRepository {
    Chamado salvar(Chamado chamado);
    Optional<Chamado> buscarPorId(Long id);
    List<Chamado> listar();
}
