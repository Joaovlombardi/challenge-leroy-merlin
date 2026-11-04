package br.com.fiap.leroyguia;

import br.com.fiap.leroyguia.controller.ApiExceptionHandler;
import br.com.fiap.leroyguia.controller.ChamadoController;
import br.com.fiap.leroyguia.controller.LojaController;
import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.Loja;
import br.com.fiap.leroyguia.model.Produto;
import br.com.fiap.leroyguia.model.StatusChamado;
import br.com.fiap.leroyguia.repository.CatalogoRepository;
import br.com.fiap.leroyguia.repository.ChamadoRepository;
import br.com.fiap.leroyguia.service.CatalogoService;
import br.com.fiap.leroyguia.service.ChamadoService;
import br.com.fiap.leroyguia.service.RecursoNaoEncontradoException;
import br.com.fiap.leroyguia.service.TransicaoInvalidaException;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ApiContractTest {
    private final CatalogoRepository catalogoRepository = new CatalogoRepository() {
        private final List<Loja> lojas = List.of(
                new Loja(1L, "Loja São Paulo", "São Paulo"),
                new Loja(2L, "Loja Campinas", "Campinas"));
        private final List<Produto> produtos = List.of(
                new Produto(10L, 1L, "Tinta branca", "Tinta acrílica para parede",
                        new BigDecimal("49.90"), 4, "A2", "Tintas"),
                new Produto(11L, 2L, "Tinta branca", "Tinta acrílica para parede",
                        new BigDecimal("47.90"), 0, "B1", "Tintas"));

        @Override public List<Loja> listarLojas() { return lojas; }
        @Override public List<Produto> listarProdutos(Long lojaId) {
            return produtos.stream().filter(p -> p.lojaId().equals(lojaId)).toList();
        }
    };
    private final ChamadoRepository chamadoRepository = new ChamadoRepository() {
        private final List<Chamado> chamados = new ArrayList<>();

        @Override public Chamado salvar(Chamado chamado) {
            Chamado salvo = chamado.id() == null
                    ? new Chamado((long) chamados.size() + 1, chamado.lojaId(), chamado.produtoId(),
                            chamado.descricao(), chamado.status(), chamado.criadoEm(), chamado.atualizadoEm())
                    : chamado;
            chamados.removeIf(item -> item.id().equals(salvo.id()));
            chamados.add(salvo);
            return salvo;
        }
        @Override public Optional<Chamado> buscarPorId(Long id) {
            return chamados.stream().filter(item -> item.id().equals(id)).findFirst();
        }
        @Override public List<Chamado> listar() { return List.copyOf(chamados); }
    };
    private CatalogoService catalogo;
    private ChamadoService chamados;
    private MockMvc mvc;

    @BeforeEach
    void preparar() {
        catalogo = new CatalogoService(catalogoRepository);
        chamados = new ChamadoService(chamadoRepository, catalogo,
                Clock.fixed(Instant.parse("2026-11-04T12:00:00Z"), ZoneOffset.UTC));
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mvc = MockMvcBuilders.standaloneSetup(new LojaController(catalogo), new ChamadoController(chamados))
                .setControllerAdvice(new ApiExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void filtraLojasPorCidadeEProdutoDisponivel() throws Exception {
        mvc.perform(get("/api/lojas").param("cidade", "sao").param("produto", "tinta parede"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$.length()").value(1));
        assertTrue(catalogo.listarLojas(null, "tinta").stream().noneMatch(loja -> loja.id() == 2L));
    }

    @Test
    void retornaProdutoComPrecoEstoqueELocalizacao() throws Exception {
        mvc.perform(get("/api/lojas/1/produtos").param("busca", "acrilica branca"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
        mvc.perform(get("/api/lojas/1/produtos/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preco").value(49.90))
                .andExpect(jsonPath("$.estoque").value(4))
                .andExpect(jsonPath("$.corredor").value("A2"))
                .andExpect(jsonPath("$.secao").value("Tintas"));
        mvc.perform(get("/api/lojas/1/produtos/11")).andExpect(status().isNotFound());
        mvc.perform(get("/api/lojas/999/produtos")).andExpect(status().isNotFound());
    }

    @Test
    void criaListaEAtualizaChamado() throws Exception {
        mvc.perform(post("/api/chamados").contentType("application/json")
                        .content("{\"lojaId\":1,\"produtoId\":10,\"descricao\":\"Preciso de ajuda\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/chamados/1"))
                .andExpect(jsonPath("$.status").value("ABERTO"));
        mvc.perform(get("/api/chamados").param("lojaId", "1").param("status", "ABERTO"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
        mvc.perform(patch("/api/chamados/1/status").contentType("application/json")
                        .content("{\"status\":\"EM_ATENDIMENTO\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("EM_ATENDIMENTO"));
        mvc.perform(patch("/api/chamados/1/status").contentType("application/json")
                        .content("{\"status\":\"CONCLUIDO\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CONCLUIDO"));
    }

    @Test
    void rejeitaDadosInvalidosETransicaoImpossivel() throws Exception {
        mvc.perform(post("/api/chamados").contentType("application/json")
                        .content("{\"lojaId\":1,\"descricao\":\" \"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/chamados").contentType("application/json")
                        .content("{\"lojaId\":1,\"produtoId\":11,\"descricao\":\"Ajuda\"}"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/chamados").param("status", "DESCONHECIDO"))
                .andExpect(status().isBadRequest());
        Chamado aberto = chamados.abrir(1L, null, "Ajuda");
        assertThrows(TransicaoInvalidaException.class,
                () -> chamados.mudarStatus(aberto.id(), StatusChamado.CONCLUIDO));
        assertThrows(RecursoNaoEncontradoException.class,
                () -> chamados.mudarStatus(999L, StatusChamado.EM_ATENDIMENTO));
    }
}
