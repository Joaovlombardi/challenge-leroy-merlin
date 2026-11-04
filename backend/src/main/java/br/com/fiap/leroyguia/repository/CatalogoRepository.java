package br.com.fiap.leroyguia.repository;

import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import java.util.List;

/** Contrato a ser implementado pela persistência da pessoa 4. */
public interface CatalogoRepository {
    List<Loja> listarLojas();
    List<Produto> listarProdutos(Long lojaId);
}
