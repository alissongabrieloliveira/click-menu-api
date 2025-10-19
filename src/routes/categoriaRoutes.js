const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

router.get("/", categoriaController.getCategorias);
router.post("/", categoriaController.postCategoria);

module.exports = router;
