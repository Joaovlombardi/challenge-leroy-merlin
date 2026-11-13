package br.com.fiap.leroyguia.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Produto(Long id, Long lojaId, String nome, String descricao,
                      BigDecimal preco, int estoque, String corredor, String secao,
                      String marca, BigDecimal avaliacao, String imagemUrl) {
    public Produto(Long id, Long lojaId, String nome, String descricao,
                   BigDecimal preco, int estoque, String corredor, String secao) {
        this(id, lojaId, nome, descricao, preco, estoque, corredor, secao, null, null, null);
    }
}
