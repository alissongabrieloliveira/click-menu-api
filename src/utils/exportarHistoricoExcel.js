// Exporta histórico de pedidos por mesa e/ou data (EXCEL)
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

async function exportarHistoricoExcel(pedidos) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pedidos");

  // Garante que o diretório exista
  const dir = path.join(__dirname, "../../uploads/exports");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Define colunas
  sheet.columns = [
    { header: "Pedido", key: "pedido", width: 10 },
    { header: "Mesa", key: "mesa", width: 10 },
    { header: "Status", key: "status", width: 15 },
    { header: "Data", key: "data", width: 25 },
    { header: "Produto", key: "produto", width: 30 },
    { header: "Qtd", key: "quantidade", width: 8 },
    { header: "Preço (R$)", key: "preco", width: 12 },
    { header: "Total (R$)", key: "total", width: 12 },
  ];

  // Adiciona linhas
  pedidos.forEach((pedido) => {
    pedido.itens.forEach((item) => {
      sheet.addRow({
        pedido: pedido.id,
        mesa: pedido.mesa,
        status: pedido.status,
        data: new Date(pedido.criado_em).toLocaleString("pt-BR"),
        produto: item.produto_nome,
        quantidade: Number(item.quantidade) || 0,
        preco: Number(item.preco) || 0,
        total: Number(pedido.total) || 0,
      });
    });
  });

  // Formata colunas numéricas
  sheet.getColumn("preco").numFmt = "R$ #,##0.00";
  sheet.getColumn("total").numFmt = "R$ #,##0.00";

  // Salva arquivo
  const nomeArquivo = `historico_${Date.now()}.xlsx`;
  const caminho = path.join(dir, nomeArquivo);
  await workbook.xlsx.writeFile(caminho);

  // Retorno padronizado igual ao PDF
  return {
    path: `/uploads/exports/${nomeArquivo}`,
    file: nomeArquivo,
  };
}

module.exports = exportarHistoricoExcel;
