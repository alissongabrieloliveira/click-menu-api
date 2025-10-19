const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");

router.get("/", produtoController.getProdutos);
router.post("/", produtoController.postProduto);
router.put("/:id", produtoController.putProduto);
router.delete("/:id", produtoController.deleteProduto);

module.exports = router;
