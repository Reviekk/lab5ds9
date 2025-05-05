
// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para la página de inicio
router.get('/', productController.getHomePage);

// Ruta para ver todos los productos
router.get('/products', productController.getAllProducts);

// Ruta para ver un producto específico
router.get('/products/:id', productController.getProductById);


module.exports = router;
