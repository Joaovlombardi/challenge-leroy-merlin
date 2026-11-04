package br.com.fiap.leroyguia.model;

import java.math.BigDecimal;

public record Produto(Long id, Long lojaId, String nome, String descricao,
                      BigDecimal preco, int estoque, String corredor, String secao) {}
