const express = require("express");
const path = require("path");
const app = express();

const routes = require("./routes");

// Permite acesso aos arquivos da pasta /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json());
app.use(routes);

module.exports = app;
