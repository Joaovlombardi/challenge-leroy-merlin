package br.com.fiap.leroyguia.service;

import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import br.com.fiap.leroyguia.repository.CatalogoRepository;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CatalogoService {
    private final CatalogoRepository repository;

    public CatalogoService(CatalogoRepository repository) {
        this.repository = repository;
    }

    public List<Loja> listarLojas(String cidade, String produto) {
        return repository.listarLojas().stream()
                .filter(loja -> corresponde(loja.cidade(), cidade))
                .filter(loja -> produto == null || produto.isBlank()
                        || repository.listarProdutos(loja.id()).stream()
                                .anyMatch(item -> item.estoque() > 0 && correspondeProduto(item, produto)))
                .toList();
    }

    public Loja buscarLoja(Long lojaId) {
        return repository.listarLojas().stream()
                .filter(loja -> loja.id().equals(lojaId))
                .findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Loja não encontrada"));
    }

    public List<Produto> listarProdutos(Long lojaId, String busca) {
        buscarLoja(lojaId);
        return repository.listarProdutos(lojaId).stream()
                .filter(item -> correspondeProduto(item, busca))
                .toList();
    }

    public Produto buscarProduto(Long lojaId, Long produtoId) {
        return listarProdutos(lojaId, null).stream()
                .filter(item -> item.id().equals(produtoId))
                .findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado nessa loja"));
    }

    private static boolean correspondeProduto(Produto item, String busca) {
        return corresponde(item.nome() + " " + item.descricao(), busca);
    }

    private static boolean corresponde(String texto, String busca) {
        if (busca == null || busca.isBlank()) return true;
        String normalizado = normalizar(texto);
        return Arrays.stream(normalizar(busca).trim().split("\\s+"))
                .allMatch(normalizado::contains);
    }

    private static String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }
}
