const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/cardapio", publicController.getCardapio);
router.get("/pedido/:id", publicController.getPedidoDetalhado);
router.post("/pedido", publicController.postPedidoPublico);

module.exports = router;
