const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const categoriaRoutes = require("./categoriaRoutes");
const produtoRoutes = require("./produtoRoutes");
const pedidoRoutes = require("./pedidoRoutes");
const publicRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes");

router.get("/", healthCheck);
router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/", publicRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
