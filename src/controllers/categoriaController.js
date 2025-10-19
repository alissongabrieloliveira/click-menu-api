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

// PUT atualiza uma categoria
async function putCategoria(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });

  try {
    const categoriaAtualizada = await Categoria.atualizarCategoria(id, nome);
    if (!categoriaAtualizada) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }
    res.json(categoriaAtualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar categoria" });
  }
}

// DELETE exclui uma categoria
async function deleteCategoria(req, res) {
  const { id } = req.params;

  try {
    await Categoria.excluirCategoria(id);
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir categoria" });
  }
}

module.exports = {
  getCategorias,
  postCategoria,
  putCategoria,
  deleteCategoria,
};
