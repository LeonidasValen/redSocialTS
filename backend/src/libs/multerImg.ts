import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// Configuración para que multer guarde los archivos en un directorio
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./../frontend/public/img");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Verifica que sean imágenes antes de guardar
function fileFilter(req:Request, file:Express.Multer.File, cb:FileFilterCallback) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error("Tipo de archivo no admitido")); // Rechazar el archivo con error
    }
}

// Middleware de multer configurado con storage y fileFilter
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter, // Agregar el filtro de archivos
    limits: { files: 1 }
}).single("photo"); // "photo" es el nombre del campo en el formulario donde se envía la imagen


//post
// Configuración para que multer guarde los archivos en un directorio
const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./../frontend/public/imgPost");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Verifica que sean imágenes antes de guardar
function fileFilterPost(req:Request, file:Express.Multer.File, cb:FileFilterCallback) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error("Tipo de archivo no admitido")); // Rechazar el archivo con error
    }
}

// Middleware de multer configurado con storage y fileFilter
export const uploadPost = multer({
    storage: storagePost,
    fileFilter: fileFilterPost,
    limits: { files: 4 }
}).array("imgPost"); // "photos" es el nombre del campo en el formulario donde se envían las imágenes, y el segundo parámetro es el límite máximo de archivos