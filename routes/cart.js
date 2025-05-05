// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ruta para ver el carrito
router.get('/', cartController.getCart);

// Ruta para añadir producto al carrito
router.post('/add', cartController.addToCart);

// Ruta para actualizar un item del carrito
router.post('/update', cartController.updateCartItem);

// Ruta para eliminar un item del carrito
router.post('/remove', cartController.removeCartItem);

module.exports = router;