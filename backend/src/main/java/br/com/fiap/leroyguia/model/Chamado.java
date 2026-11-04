package br.com.fiap.leroyguia.model;

import java.time.Instant;

public record Chamado(Long id, Long lojaId, Long produtoId, String descricao,
                      StatusChamado status, Instant criadoEm, Instant atualizadoEm) {}
