package br.com.fiap.leroyguia.controller;

import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.StatusChamado;
import br.com.fiap.leroyguia.service.ChamadoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chamados")
public class ChamadoController {
    private final ChamadoService chamados;

    public ChamadoController(ChamadoService chamados) {
        this.chamados = chamados;
    }

    @PostMapping
    public ResponseEntity<Chamado> criar(@Valid @RequestBody CriarChamadoRequest request) {
        Chamado chamado = chamados.abrir(request.lojaId(), request.produtoId(), request.descricao());
        return ResponseEntity.created(URI.create("/api/chamados/" + chamado.id())).body(chamado);
    }

    @GetMapping
    public List<Chamado> listar(@RequestParam(required = false) Long lojaId,
                                @RequestParam(required = false) StatusChamado status) {
        return chamados.listar(lojaId, status);
    }

    @PatchMapping("/{id}/status")
    public Chamado atualizarStatus(@PathVariable Long id,
                                   @Valid @RequestBody AtualizarStatusRequest request) {
        return chamados.mudarStatus(id, request.status());
    }
}
