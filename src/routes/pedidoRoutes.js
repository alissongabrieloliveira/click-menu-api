const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.post("/", pedidoController.postPedido);
router.patch("/:id/status", pedidoController.patchStatusPedido);

module.exports = router;
