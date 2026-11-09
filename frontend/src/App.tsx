import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LojaAtualProvider } from '@/contexts/LojaAtualContext'
import { Layout } from '@/components/layout/Layout'
import { Inicio } from '@/pages/Inicio'
import { BuscaLojas } from '@/pages/BuscaLojas'
import { Comparador } from '@/pages/Comparador'
import { Loja } from '@/pages/Loja'
import { Produto } from '@/pages/Produto'
import { Vendedor } from '@/pages/Vendedor'
import { NaoEncontrada } from '@/pages/NaoEncontrada'

/**
 * Mapa de rotas do Leroy Guia.
 *
 * Pessoa 1: "/", "/lojas" e "/comparar".
 * Pessoa 2: "/loja/:lojaId", "/loja/:lojaId/produto/:produtoId" e "/vendedor".
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

            <Route path="loja/:lojaId" element={<Loja />} />
            <Route path="loja/:lojaId/produto/:produtoId" element={<Produto />} />
            <Route path="vendedor" element={<Vendedor />} />

            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
      </LojaAtualProvider>
    </BrowserRouter>
  )
}
