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

      const itens = itensResult.rows;

      const total = itens.reduce((soma, item) => {
        return soma + item.preco * item.quantidade;
      }, 0);

      pedidos.push({
        ...pedido,
        itens,
        total: Number(total.toFixed(2)), // duas casas decimais
      });
    }

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
}

// GET lista todos os pedidos de uma mesa específica (admin)
async function listarHistoricoPedidos(req, res) {
  const { mesa, data } = req.query;

  let query = `
    SELECT id, mesa, status, criado_em
    FROM pedidos
    WHERE 1=1
  `;
  const params = [];

  if (mesa) {
    params.push(mesa);
    query += ` AND mesa = $${params.length}`;
  }

  if (data) {
    params.push(data);
    query += ` AND DATE(criado_em) = $${params.length}`;
  }

  query += ` ORDER BY criado_em DESC`;

  try {
    const pedidosResult = await db.query(query, params);

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

      const itens = itensResult.rows;

      const total = itens.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
      );

      pedidos.push({
        ...pedido,
        total: Number(total.toFixed(2)),
        itens,
      });
    }

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar histórico de pedidos" });
  }
}

module.exports = {
  listarTodosPedidos,
  listarHistoricoPedidos,
};
