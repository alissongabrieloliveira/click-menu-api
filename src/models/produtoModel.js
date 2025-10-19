const db = require("../config/db");

// Lista os Produtos
async function listarProdutos() {
  const result = await db.query(`
    SELECT p.*, c.nome AS categoria
    FROM produtos p
    JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.id
  `);
  return result.rows;
}

// Insere um novo produto
async function inserirProduto(produto) {
  const { nome, descricao, preco, imagem_url, categoria_id } = produto;
  const result = await db.query(
    `
    INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [nome, descricao, preco, imagem_url, categoria_id]
  );
  return result.rows[0];
}

// Atualiza dados de um produto
async function atualizarProduto(id, dados) {
  const { nome, descricao, preco, imagem_url, categoria_id } = dados;

  const result = await db.query(
    `UPDATE produtos
     SET nome = $1,
         descricao = $2,
         preco = $3,
         imagem_url = $4,
         categoria_id = $5
     WHERE id = $6
     RETURNING *`,
    [nome, descricao, preco, imagem_url, categoria_id, id]
  );

  return result.rows[0];
}

// Exclui um produto
async function excluirProduto(id) {
  await db.query("DELETE FROM produtos WHERE id = $1", [id]);
}

module.exports = {
  listarProdutos,
  inserirProduto,
  atualizarProduto,
  excluirProduto,
};
