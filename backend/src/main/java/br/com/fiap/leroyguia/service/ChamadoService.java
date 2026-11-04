package br.com.fiap.leroyguia.service;

import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.StatusChamado;
import br.com.fiap.leroyguia.repository.ChamadoRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChamadoService {
    private final ChamadoRepository repository;
    private final CatalogoService catalogo;
    private final Clock clock;

    @Autowired
    public ChamadoService(ChamadoRepository repository, CatalogoService catalogo) {
        this(repository, catalogo, Clock.systemUTC());
    }

    public ChamadoService(ChamadoRepository repository, CatalogoService catalogo, Clock clock) {
        this.repository = repository;
        this.catalogo = catalogo;
        this.clock = clock;
    }

    public Chamado abrir(Long lojaId, Long produtoId, String descricao) {
        catalogo.buscarLoja(lojaId);
        if (produtoId != null) catalogo.buscarProduto(lojaId, produtoId);
        Instant agora = clock.instant();
        return repository.salvar(new Chamado(null, lojaId, produtoId, descricao.trim(),
                StatusChamado.ABERTO, agora, agora));
    }

    public List<Chamado> listar(Long lojaId, StatusChamado status) {
        if (lojaId != null) catalogo.buscarLoja(lojaId);
        return repository.listar().stream()
                .filter(chamado -> lojaId == null || chamado.lojaId().equals(lojaId))
                .filter(chamado -> status == null || chamado.status() == status)
                .toList();
    }

    public Chamado mudarStatus(Long id, StatusChamado novoStatus) {
        Chamado atual = repository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Chamado não encontrado"));
        boolean permitido = atual.status() == StatusChamado.ABERTO
                && novoStatus == StatusChamado.EM_ATENDIMENTO
                || atual.status() == StatusChamado.EM_ATENDIMENTO
                && novoStatus == StatusChamado.CONCLUIDO;
        if (!permitido) throw new TransicaoInvalidaException("Transição de status inválida");
        return repository.salvar(new Chamado(atual.id(), atual.lojaId(), atual.produtoId(),
                atual.descricao(), novoStatus, atual.criadoEm(), clock.instant()));
    }
}
