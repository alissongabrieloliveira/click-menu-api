const express = require("express");
const router = express.Router();

const { healthCheck } = require("../controllers/healthController");
const categoriaRoutes = require("./categoriaRoutes");

router.get("/", healthCheck);
router.use("/categorias", categoriaRoutes);

module.exports = router;
