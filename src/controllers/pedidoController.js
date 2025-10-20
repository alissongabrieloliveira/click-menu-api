const Pedido = require("../models/pedidoModel");

// POST criar um novo pedido
async function postPedido(req, res) {
  const { mesa, itens } = req.body;

  if (!mesa || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Mesa e itens são obrigatórios" });
  }

  try {
    const novoPedido = await Pedido.criarPedido(mesa, itens);
    res.status(201).json({
      mensagem: "Pedido criado com sucesso",
      pedido_id: novoPedido.id,
      mesa: novoPedido.mesa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
}

module.exports = {
  postPedido,
};
