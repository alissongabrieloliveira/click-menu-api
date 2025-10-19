const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");

router.get("/", produtoController.getProdutos);
router.post("/", produtoController.postProduto);

module.exports = router;
