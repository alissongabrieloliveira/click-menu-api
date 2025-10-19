const db = require("../config/db");

// Lista as Categorias
async function listarCategorias() {
  const result = await db.query("SELECT * FROM categorias ORDER BY id");
  return result.rows;
}

// Inserir Categorias
async function inserirCategoria(nome) {
  const result = await db.query(
    "INSERT INTO categorias (nome) VALUES ($1) RETURNING *",
    [nome]
  );
  return result.rows[0];
}

// Atualiza dados da categoria
async function atualizarCategoria(id, nome) {
  const result = await db.query(
    "UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *",
    [nome, id]
  );
  return result.rows[0];
}

// Exclui uma categoria
async function excluirCategoria(id) {
  await db.query("DELETE FROM categorias WHERE id = $1", [id]);
}

module.exports = {
  listarCategorias,
  inserirCategoria,
  atualizarCategoria,
  excluirCategoria,
};
