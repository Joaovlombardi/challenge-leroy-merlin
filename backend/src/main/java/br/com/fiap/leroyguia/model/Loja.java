package br.com.fiap.leroyguia.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Loja(Long id, String nome, String cidade, String endereco) {
    public Loja(Long id, String nome, String cidade) {
        this(id, nome, cidade, null);
    }
}
