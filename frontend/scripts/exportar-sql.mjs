import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

// O catálogo do frontend é a fonte dos dados de exemplo também usados pelo H2.
const origem = resolve('src/mocks/dados.ts')
const destino = resolve('../backend/src/main/resources/data.sql')
const codigo = ts.transpileModule(readFileSync(origem, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const dados = {}
runInNewContext(codigo, { exports: dados }, { filename: origem })

const texto = (valor) => valor == null ? 'NULL' : `'${String(valor).replaceAll("'", "''")}'`
const numero = (valor) => valor == null ? 'NULL' : String(valor)
const linhas = ['-- Gerado de frontend/src/mocks/dados.ts por npm run export:sql.', '-- Não editar à mão.', '']

for (const loja of dados.lojasMock) {
  linhas.push(`INSERT INTO loja (id, nome, cidade, endereco) VALUES (${loja.id}, ${texto(loja.nome)}, ${texto(loja.cidade)}, ${texto(loja.endereco)});`)
}
linhas.push('')

const ids = new Set()
for (const produto of dados.produtosMock) {
  if (ids.has(produto.id)) throw new Error(`ID de produto duplicado: ${produto.id}`)
  if (!dados.lojasMock.some((loja) => loja.id === produto.lojaId)) throw new Error(`Loja ausente: ${produto.lojaId}`)
  if (!/^[A-F][1-5]$/.test(produto.corredor)) throw new Error(`Corredor inválido: ${produto.corredor}`)
  ids.add(produto.id)
  linhas.push(`INSERT INTO produto (id, loja_id, nome, descricao, preco, estoque, corredor, secao, marca, avaliacao, imagem_url) VALUES (${produto.id}, ${produto.lojaId}, ${texto(produto.nome)}, ${texto(produto.descricao)}, ${numero(produto.preco.toFixed(2))}, ${numero(produto.estoque)}, ${texto(produto.corredor)}, ${texto(produto.secao)}, ${texto(produto.marca)}, ${numero(produto.avaliacao)}, ${texto(produto.imagemUrl)});`)
}

const sql = `${linhas.join('\n')}\n`
if (process.argv.includes('--check')) {
  if (readFileSync(destino, 'utf8') !== sql) {
    throw new Error('data.sql difere de frontend/src/mocks/dados.ts; rode npm run export:sql')
  }
  console.log('data.sql está sincronizado com o frontend')
} else {
  writeFileSync(destino, sql, 'utf8')
  console.log(`Gerados ${dados.lojasMock.length} lojas e ${dados.produtosMock.length} produtos em ${destino}`)
}
