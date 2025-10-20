const db = require("../config/db");

// GET listar todos os pedidos com status e itens (admin)
async function listarTodosPedidos(req, res) {
  try {
    const pedidosResult = await db.query(`
      SELECT id, mesa, status, criado_em
      FROM pedidos
      ORDER BY
        CASE 
          WHEN status = 'pendente' THEN 1
          WHEN status = 'preparando' THEN 2
          WHEN status = 'entregue' THEN 3
          WHEN status = 'finalizado' THEN 4
          ELSE 5
        END,
        criado_em ASC
    `);

    const pedidos = [];

    for (const pedido of pedidosResult.rows) {
      const itensResult = await db.query(
        `
        SELECT 
          ip.quantidade,
          p.nome AS produto_nome,
          p.preco
        FROM itens_pedido ip
        JOIN produtos p ON p.id = ip.produto_id
        WHERE ip.pedido_id = $1
      `,
        [pedido.id]
      );

      pedidos.push({
        ...pedido,
        itens: itensResult.rows,
      });
    }

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
}

module.exports = {
  listarTodosPedidos,
};
