const multer = require("multer");
const path = require("path");

// Define o destino e o nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/produtos"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + ext;
    cb(null, nomeArquivo);
  },
});

// Apenas imagens permitidas
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo inválido"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
