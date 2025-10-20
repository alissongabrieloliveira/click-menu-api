const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.post("/", pedidoController.postPedido);

module.exports = router;
