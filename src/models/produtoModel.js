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

module.exports = {
  listarProdutos,
  inserirProduto,
};
