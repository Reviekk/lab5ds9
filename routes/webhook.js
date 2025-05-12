// routes/webhook.js
      const express = require('express');
      const router = express.Router();
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const { Order } = require('../models');
      
      // Esta ruta debe ser excluida de la protección CSRF
      router.post('/stripe', express.raw({type: 'application/json'}), async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;
      
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          console.error(`Error en webhook: ${err.message}`);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      
        // Manejar el evento de pago exitoso
        if (event.type === 'payment_intent.succeeded') {
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata.orderId;
          
          try {
            // Actualizar la orden en la base de datos
            const order = await Order.findByPk(orderId);
            if (order) {
              await order.update({
                status: 'paid',
                paymentId: paymentIntent.id
              });
            }
          } catch (error) {
            console.error('Error al actualizar la orden:', error);
          }
        }
      
        // Devolver una respuesta exitosa
        res.json({received: true});
      });
      
      module.exports = router;