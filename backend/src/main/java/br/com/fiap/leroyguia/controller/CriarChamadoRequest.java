package br.com.fiap.leroyguia.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CriarChamadoRequest(@NotNull @Positive Long lojaId,
                                  @Positive Long produtoId,
                                  @NotBlank String descricao) {}
