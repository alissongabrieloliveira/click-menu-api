const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const categoriaRoutes = require("./categoriaRoutes");
const produtoRoutes = require("./produtoRoutes");

router.get("/", healthCheck);
router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtoRoutes);

module.exports = router;
