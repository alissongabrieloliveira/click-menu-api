const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const upload = require("../middleware/uploadProduto");

router.get("/", produtoController.getProdutos);
router.post("/", produtoController.postProduto);
router.put("/:id", produtoController.putProduto);
router.delete("/:id", produtoController.deleteProduto);

// Rota de upload de imagens
router.post("/upload", upload.single("imagem"), (req, res) => {
  const filename = req.file.filename;
  const url = `/uploads/produtos/${filename}`;

  res.status(201).json({
    mensagem: "Imagem enviada com sucesso",
    url: url,
  });
});

module.exports = router;
