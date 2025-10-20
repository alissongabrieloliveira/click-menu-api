const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/pedidos", adminController.listarTodosPedidos);

module.exports = router;
