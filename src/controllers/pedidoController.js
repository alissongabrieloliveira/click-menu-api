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

// Tipos de status
const statusPermitidos = ["pendente", "preparando", "entregue", "finalizado"];

// PATCH atualiza o status do pedido
async function patchStatusPedido(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ erro: "Status inválido" });
  }

  try {
    const pedidoAtualizado = await Pedido.atualizarStatusPedido(id, status);
    if (!pedidoAtualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json({
      mensagem: "Status atualizado com sucesso",
      pedido: pedidoAtualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status do pedido" });
  }
}

module.exports = {
  postPedido,
  patchStatusPedido,
};
