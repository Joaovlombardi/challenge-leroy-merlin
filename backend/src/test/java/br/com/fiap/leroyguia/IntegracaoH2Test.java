package br.com.fiap.leroyguia;

import br.com.fiap.leroyguia.model.Chamado;
import br.com.fiap.leroyguia.model.StatusChamado;
import br.com.fiap.leroyguia.repository.ChamadoRepository;
import br.com.fiap.leroyguia.service.CatalogoService;
import br.com.fiap.leroyguia.service.ChamadoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class IntegracaoH2Test {
    @Autowired private CatalogoService catalogo;
    @Autowired private ChamadoService chamados;
    @Autowired private ChamadoRepository repository;
    @Autowired private WebApplicationContext contexto;

    @Test
    void dadosDoFrontEChamadosFuncionamNoBancoReal() throws Exception {
        assertEquals(4, catalogo.listarLojas(null, null).size());
        assertEquals(86, catalogo.listarLojas(null, null).stream()
                .mapToInt(loja -> catalogo.listarProdutos(loja.id(), null).size()).sum());
        assertEquals("Loja Morumbi", catalogo.buscarLoja(1L).nome());
        assertEquals("Colorlar", catalogo.buscarProduto(1L, 101L).marca());
        assertEquals(0, catalogo.buscarProduto(2L, 202L).estoque());

        Chamado criado = chamados.abrir(1L, 101L, " Preciso de ajuda ");
        assertNotNull(criado.id());
        assertEquals("Preciso de ajuda", criado.descricao());
        Chamado atendendo = chamados.mudarStatus(criado.id(), StatusChamado.EM_ATENDIMENTO);
        assertEquals(StatusChamado.EM_ATENDIMENTO, repository.buscarPorId(criado.id()).orElseThrow().status());
        assertFalse(atendendo.atualizadoEm().isBefore(atendendo.criadoEm()));

        MockMvc mvc = MockMvcBuilders.webAppContextSetup(contexto).build();
        mvc.perform(get("/api/lojas/1/produtos/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101))
                .andExpect(jsonPath("$.marca").value("Colorlar"))
                .andExpect(jsonPath("$.avaliacao").value(4.0))
                .andExpect(jsonPath("$.corredor").value("A2"));
    }
}
