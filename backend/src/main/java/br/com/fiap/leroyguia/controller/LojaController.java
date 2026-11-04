package br.com.fiap.leroyguia.controller;

import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import br.com.fiap.leroyguia.service.CatalogoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lojas")
public class LojaController {
    private final CatalogoService catalogo;

    public LojaController(CatalogoService catalogo) {
        this.catalogo = catalogo;
    }

    @GetMapping
    public List<Loja> listar(@RequestParam(required = false) String cidade,
                             @RequestParam(required = false) String produto) {
        return catalogo.listarLojas(cidade, produto);
    }

    @GetMapping("/{lojaId}/produtos")
    public List<Produto> produtos(@PathVariable Long lojaId,
                                  @RequestParam(required = false) String busca) {
        return catalogo.listarProdutos(lojaId, busca);
    }

    @GetMapping("/{lojaId}/produtos/{produtoId}")
    public Produto produto(@PathVariable Long lojaId, @PathVariable Long produtoId) {
        return catalogo.buscarProduto(lojaId, produtoId);
    }
}
