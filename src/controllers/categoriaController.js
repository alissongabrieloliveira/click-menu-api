const Categoria = require("../models/categoriaModel");

// GET lista todas as categorias
async function getCategorias(req, res) {
  try {
    const categorias = await Categoria.listarCategorias();
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar categorias" });
  }
}

// POST cria uma nova categoria
async function postCategoria(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });

  try {
    const novaCategoria = await Categoria.inserirCategoria(nome);
    res.status(201).json(novaCategoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao inserir categoria" });
  }
}

module.exports = {
  getCategorias,
  postCategoria,
};
