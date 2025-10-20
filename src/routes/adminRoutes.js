const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/pedidos", adminController.listarTodosPedidos);
router.get("/historico", adminController.listarHistoricoPedidos);

module.exports = router;
