// Gera comprovante de pedido finalizado (após finalização do pedido)
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function gerarComprovantePDF(pedido, callback) {
  const doc = new PDFDocument({ margin: 40 });

  const nomeArquivo = `pedido_${pedido.id}.pdf`;
  const dir = path.join(__dirname, "../../uploads/comprovantes");
  const caminho = path.join(dir, nomeArquivo);

  // Garante que a pasta existe
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const stream = fs.createWriteStream(caminho);
  doc.pipe(stream);

  // Cabeçalho
  doc
    .fontSize(18)
    .text(`Click Menu - Pedido #${pedido.id}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(`Mesa: ${pedido.mesa}`);
  doc.text(`Status: ${pedido.status}`);
  doc.text(`Data: ${new Date(pedido.criado_em).toLocaleString("pt-BR")}`);
  doc.moveDown();

  // Itens
  doc.text("Itens:", { underline: true });
  doc.moveDown(0.5);

  // Converte preços para número
  pedido.itens.forEach((item) => {
    const precoNumerico = Number(item.preco);
    const linha = `${item.quantidade}x ${item.produto_nome}`;
    const valor = `R$ ${precoNumerico.toFixed(2).replace(".", ",")}`;
    doc.text(`${linha.padEnd(30)}${valor}`, { continued: false });
  });

  // Total
  doc.moveDown();
  const totalNumerico = Number(pedido.total);
  doc
    .fontSize(14)
    .text(`Total: R$ ${totalNumerico.toFixed(2).replace(".", ",")}`, {
      align: "right",
    });

  // Finaliza
  doc.end();

  stream.on("finish", () => {
    callback(`/uploads/comprovantes/${nomeArquivo}`);
  });
}

module.exports = gerarComprovantePDF;
