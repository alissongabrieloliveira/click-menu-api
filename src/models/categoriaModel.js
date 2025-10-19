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

module.exports = {
  listarCategorias,
  inserirCategoria,
};
