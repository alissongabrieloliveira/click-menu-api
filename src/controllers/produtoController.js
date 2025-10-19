const Produto = require("../models/produtoModel");

// GET lista todos os produtos
async function getProdutos(req, res) {
  try {
    const produtos = await Produto.listarProdutos();
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
}

// POST cria um novo produto
async function postProduto(req, res) {
  const { nome, descricao, preco, imagem_url, categoria_id } = req.body;

  if (!nome || !preco || !categoria_id) {
    return res
      .status(400)
      .json({ erro: "Nome, preço e categoria_id são obrigatórios" });
  }

  try {
    const novoProduto = await Produto.inserirProduto({
      nome,
      descricao,
      preco,
      imagem_url,
      categoria_id,
    });
    res.status(201).json(novoProduto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao inserir produto" });
  }
}

module.exports = {
  getProdutos,
  postProduto,
};
