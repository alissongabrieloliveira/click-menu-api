const db = require("../config/db");

// Criar pedido
async function criarPedido(mesa, itens) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const pedidoResult = await client.query(
      "INSERT INTO pedidos (mesa) VALUES ($1) RETURNING *",
      [mesa]
    );

    const pedido = pedidoResult.rows[0];

    for (const item of itens) {
      await client.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade)
         VALUES ($1, $2, $3)`,
        [pedido.id, item.produto_id, item.quantidade]
      );
    }

    await client.query("COMMIT");
    return pedido;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Atualizar o status do pedido
async function atualizarStatusPedido(id, novoStatus) {
  const result = await db.query(
    "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *",
    [novoStatus, id]
  );
  return result.rows[0];
}

module.exports = {
  criarPedido,
  atualizarStatusPedido,
};
