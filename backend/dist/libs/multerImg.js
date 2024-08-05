"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPost = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuración para que multer guarde los archivos en un directorio
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./../frontend/public/img");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
// Verifica que sean imágenes antes de guardar
function fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    }
    else {
        cb(new Error("Tipo de archivo no admitido")); // Rechazar el archivo con error
    }
}
// Middleware de multer configurado con storage y fileFilter
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter, // Agregar el filtro de archivos
    limits: { files: 1 }
}).single("photo"); // "photo" es el nombre del campo en el formulario donde se envía la imagen
//post
// Configuración para que multer guarde los archivos en un directorio
const storagePost = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./../frontend/public/imgPost");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
// Verifica que sean imágenes antes de guardar
function fileFilterPost(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    }
    else {
        cb(new Error("Tipo de archivo no admitido")); // Rechazar el archivo con error
    }
}
// Middleware de multer configurado con storage y fileFilter
exports.uploadPost = (0, multer_1.default)({
    storage: storagePost,
    fileFilter: fileFilterPost,
    limits: { files: 4 }
}).array("imgPost"); // "photos" es el nombre del campo en el formulario donde se envían las imágenes, y el segundo parámetro es el límite máximo de archivos
