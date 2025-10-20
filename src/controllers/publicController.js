const db = require("../config/db");
const pedidoModel = require("../models/pedidoModel");

// GET rota pública /cardapio
async function getCardapio(req, res) {
  try {
    const result = await db.query(`
      SELECT 
        c.id AS categoria_id,
        c.nome AS categoria_nome,
        p.id AS produto_id,
        p.nome AS produto_nome,
        p.descricao,
        p.preco,
        p.imagem_url
      FROM categorias c
      JOIN produtos p ON p.categoria_id = c.id
      ORDER BY c.id, p.id
    `);

    const categoriasMap = {};

    result.rows.forEach((row) => {
      if (!categoriasMap[row.categoria_id]) {
        categoriasMap[row.categoria_id] = {
          id: row.categoria_id,
          nome: row.categoria_nome,
          produtos: [],
        };
      }

      categoriasMap[row.categoria_id].produtos.push({
        id: row.produto_id,
        nome: row.produto_nome,
        descricao: row.descricao,
        preco: row.preco,
        imagem_url: row.imagem_url,
      });
    });

    const cardapio = Object.values(categoriasMap);

    res.json(cardapio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar o cardápio" });
  }
}

// GET rota pública /pedido/:id
async function getPedidoDetalhado(req, res) {
  const { id } = req.params;

  try {
    const pedidoResult = await db.query(
      `
      SELECT id, mesa, status, criado_em
      FROM pedidos
      WHERE id = $1
    `,
      [id]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    const pedido = pedidoResult.rows[0];

    const itensResult = await db.query(
      `
      SELECT 
        ip.quantidade,
        p.nome AS produto_nome,
        p.preco,
        p.imagem_url
      FROM itens_pedido ip
      JOIN produtos p ON p.id = ip.produto_id
      WHERE ip.pedido_id = $1
    `,
      [id]
    );

    pedido.itens = itensResult.rows;

    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar pedido" });
  }
}

// POST rota publica /pedido direto do cliente sem painel
async function postPedidoPublico(req, res) {
  const { mesa, itens } = req.body;

  if (!mesa || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Mesa e itens são obrigatórios" });
  }

  try {
    const novoPedido = await pedidoModel.criarPedido(mesa, itens);
    res.status(201).json({
      mensagem: "Pedido criado com sucesso",
      pedido_id: novoPedido.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
}

module.exports = {
  getCardapio,
  getPedidoDetalhado,
  postPedidoPublico,
};
