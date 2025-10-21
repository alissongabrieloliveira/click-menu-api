// Exporta histórico de pedidos por mesa e/ou data (PDF)
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function exportarHistoricoPDF(pedidos) {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.join(__dirname, "../../uploads/exports");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const nomeArquivo = `historico_${Date.now()}.pdf`;
      const caminho = path.join(dir, nomeArquivo);

      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(caminho);

      // Captura erro de escrita
      stream.on("error", (err) => {
        console.error("Erro no stream PDF:", err);
        reject(err);
      });

      doc.pipe(stream);

      // Cabeçalho
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Histórico de Pedidos - Click Menu", { align: "center" });
      doc.moveDown(1.5);

      // Nenhum pedido
      if (!pedidos || pedidos.length === 0) {
        doc.fontSize(12).text("Nenhum pedido encontrado.", { align: "center" });
        doc.end();
        stream.on("finish", () =>
          resolve({
            path: `/uploads/exports/${nomeArquivo}`,
            file: nomeArquivo,
          })
        );
        return;
      }

      // Corpo do PDF
      pedidos.forEach((pedido, index) => {
        const data = new Date(pedido.criado_em).toLocaleString("pt-BR");
        doc
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(
            `Pedido #${pedido.id} | Mesa: ${pedido.mesa} | Status: ${pedido.status} | Data: ${data}`
          )
          .moveDown(0.3);

        if (Array.isArray(pedido.itens) && pedido.itens.length > 0) {
          pedido.itens.forEach((item) => {
            const preco = Number(item.preco) || 0;
            const qtd = Number(item.quantidade) || 0;
            const nome = item.produto_nome || "Produto desconhecido";

            doc
              .fontSize(12)
              .font("Helvetica")
              .text(
                `  - ${qtd}x ${nome} (R$ ${preco.toFixed(2).replace(".", ",")})`
              );
          });
        } else {
          doc.fontSize(12).text("  (Sem itens neste pedido)");
        }

        const total = Number(pedido.total) || 0;
        doc.moveDown(0.2);
        doc
          .font("Helvetica-Bold")
          .text(`  Total: R$ ${total.toFixed(2).replace(".", ",")}`);
        doc.moveDown(0.5);

        if (index < pedidos.length - 1) {
          doc
            .font("Helvetica")
            .text("---------------------------------------------", {
              align: "center",
            });
          doc.moveDown(0.8);
        }
      });

      // Rodapé
      doc.moveDown(1.5);
      doc
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, {
          align: "right",
        });

      doc.end();

      // Finaliza ao terminar de escrever o arquivo
      stream.on("finish", () => {
        resolve({
          path: `/uploads/exports/${nomeArquivo}`,
          file: nomeArquivo,
        });
      });
    } catch (err) {
      console.error("Erro no exportarHistoricoPDF:", err);
      reject(err);
    }
  });
}

module.exports = exportarHistoricoPDF;
