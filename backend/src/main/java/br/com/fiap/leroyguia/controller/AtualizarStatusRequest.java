package br.com.fiap.leroyguia.controller;

import br.com.fiap.leroyguia.model.StatusChamado;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(@NotNull StatusChamado status) {}
