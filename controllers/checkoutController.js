// controllers/checkoutController.js
const { Order, OrderItem, Product } = require('../models');

const checkoutController = {
  // Mostrar la página de checkout
  getCheckoutPage: (req, res) => {
    // Verificar si hay items en el carrito
    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.redirect('/cart');
    }
    
    res.render('checkout', { 
      title: 'Finalizar Compra',
      cart: req.session.cart 
    });
  },

  // Procesar el pedido y redirigir a la pasarela de pago
  processCheckout: async (req, res) => {
    try {
      // Verificar si hay items en el carrito
      if (!req.session.cart || req.session.cart.items.length === 0) {
        return res.redirect('/cart');
      }
      
      const cart = req.session.cart;
      
      // Crear la orden en la base de datos
      const order = await Order.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        zip: req.body.zip,
        phone: req.body.phone,
        total: cart.totalPrice,
        status: 'pending'
      });
      
      // Crear items de la orden
      for (const item of cart.items) {
        await OrderItem.create({
          OrderId: order.id,
          ProductId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        });
        
        // Actualizar el stock del producto
        const product = await Product.findByPk(item.product.id);
        await product.update({
          stock: product.stock - item.quantity
        });
      }
      
      // Guardar la orden en la sesión para accederla en la página de pago
      req.session.orderId = order.id;
      
      // Redirigir a la página de pago
      res.redirect(`/checkout/payment?orderId=${order.id}`);
    } catch (error) {
      console.error('Error al procesar el checkout:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al procesar el pedido'
      });
    }
  },

  // Mostrar la página de pago con PagueloFácil
  getPaymentPage: async (req, res) => {
    try {
      const orderId = req.query.orderId;
      
      // Obtener la orden
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).render('404', {
          title: 'Orden no encontrada'
        });
      }
      
      res.render('payment', {
        title: 'Procesar Pago',
        order: order,
        paguelofacil: {
          cclw: process.env.PAGUELOFACIL_CCLW,
          apiKey: process.env.PAGUELOFACIL_API_KEY
        },
        isPagueloFacilPage: true
      });
    } catch (error) {
      console.error('Error al cargar la página de pago:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cargar la página de pago'
      });
    }
  },

  // Manejar el retorno exitoso del pago
  handleSuccessPayment: async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const txId = req.query.txId;
      
      if (!orderId) {
        return res.redirect('/');
      }
      
      // Obtener la orden
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).render('404', {
          title: 'Orden no encontrada'
        });
      }
      
      // Actualizar estado de la orden
      await order.update({
        status: 'paid',
        paymentId: txId
      });
      
      // Limpiar el carrito
      req.session.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0
      };
      
      // Mostrar página de éxito
      res.render('order-success', {
        title: 'Pedido Completado',
        order
      });
    } catch (error) {
      console.error('Error al procesar pago exitoso:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al procesar respuesta del pago'
      });
    }
  },

  // Manejar el retorno fallido del pago
  handleFailedPayment: async (req, res) => {
    try {
      const orderId = req.query.orderId;
      
      if (orderId) {
        // Actualizar estado de la orden
        const order = await Order.findByPk(orderId);
        if (order) {
          await order.update({
            status: 'payment_failed'
          });
        }
      }
      
      // Mostrar mensaje de error
      res.render('payment-failed', {
        title: 'Pago Fallido',
        message: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'
      });
    } catch (error) {
      console.error('Error al procesar pago fallido:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al procesar respuesta del pago'
      });
    }
  },

  // Manejar la cancelación del pago
  handleCancelPayment: async (req, res) => {
    const orderId = req.query.orderId;
    
    if (orderId) {
      // Actualizar estado de la orden
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          status: 'canceled'
        });
      }
    }
    
    // Redirigir al carrito
    res.redirect('/cart');
  }
};

module.exports = checkoutController;