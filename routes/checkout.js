// routes/checkout.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Ruta para mostrar la página de checkout
router.get('/', checkoutController.getCheckoutPage);

// Ruta para procesar el formulario de checkout
router.post('/process', checkoutController.processCheckout);

// Ruta para mostrar la página de pago
router.get('/payment', checkoutController.getPaymentPage);

// Rutas para manejar respuestas de pago
router.get('/success', checkoutController.handleSuccessPayment);
router.get('/failed', checkoutController.handleFailedPayment);
router.get('/cancel', checkoutController.handleCancelPayment);

module.exports = router;
