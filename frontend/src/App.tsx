import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LojaAtualProvider } from '@/contexts/LojaAtualContext'
import { Layout } from '@/components/layout/Layout'
import { Inicio } from '@/pages/Inicio'
import { BuscaLojas } from '@/pages/BuscaLojas'
import { Comparador } from '@/pages/Comparador'
import { EmConstrucao } from '@/pages/EmConstrucao'
import { NaoEncontrada } from '@/pages/NaoEncontrada'

/**
 * Mapa de rotas do Leroy Guia.
 *
 * Pessoa 1: "/", "/lojas" e "/comparar".
 * Pessoa 2: "/loja/:lojaId", "/loja/:lojaId/produto/:produtoId" e "/vendedor".
 * As rotas da Pessoa 2 apontam para um placeholder até ela substituir.
 */
export default function App() {
  return (
    <BrowserRouter>
      <LojaAtualProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="lojas" element={<BuscaLojas />} />
            <Route path="comparar" element={<Comparador />} />

            <Route
              path="loja/:lojaId"
              element={
                <EmConstrucao
                  titulo="Tela da loja"
                  descricao="Aqui o cliente descreve o que precisa e vê produto, preço e o caminho na planta. Aceita ?busca= para já abrir com um termo e ?chamar=1 para abrir o chamado de vendedor."
                />
              }
            />
            <Route
              path="loja/:lojaId/produto/:produtoId"
              element={
                <EmConstrucao
                  titulo="Produto e rota na planta"
                  descricao="Detalhe do produto com corredor, seção e o traçado até a prateleira, além do botão de chamar vendedor."
                />
              }
            />
            <Route
              path="vendedor"
              element={
                <EmConstrucao
                  titulo="Painel do vendedor"
                  descricao="Lista de chamados abertos por loja, com os botões de atender e concluir."
                />
              }
            />

            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
      </LojaAtualProvider>
    </BrowserRouter>
  )
}
