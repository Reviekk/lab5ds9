// controllers/cartController.js
const { Product } = require('../models');

const cartController = {
  // Mostrar el carrito
  getCart: (req, res) => {
    res.render('cart', { 
      title: 'Carrito de Compras',
      cart: req.session.cart 
    });
  },

  // Añadir producto al carrito
  addToCart: async (req, res) => {
    try {
      const productId = req.body.productId;
      const quantity = parseInt(req.body.quantity) || 1;
      
      // Obtener el producto de la base de datos
      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).send('Producto no encontrado');
      }
      
      // Verificar stock disponible
      if (product.stock < quantity) {
        return res.status(400).render('error', {
          title: 'Error',
          message: 'No hay suficiente stock disponible'
        });
      }
      
      let cart = req.session.cart;
      
      // Buscar si el producto ya está en el carrito
      const existingItemIndex = cart.items.findIndex(item => 
        item.product.id === product.id
      );
      
      if (existingItemIndex > -1) {
        // Si ya existe, actualizar cantidad
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Si no existe, agregar nuevo item
        cart.items.push({
          product: {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            imageUrl: product.imageUrl
          },
          quantity: quantity
        });
      }
      
      // Calcular totales
      cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
      );
      
      // Guardar carrito actualizado en la sesión
      req.session.cart = cart;
      
      res.redirect('/cart');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al agregar al carrito'
      });
    }
  },

  // Actualizar cantidad de un producto en el carrito
  updateCartItem: (req, res) => {
    try {
      const productId = req.body.productId;
      const quantity = parseInt(req.body.quantity);
      
      if (quantity <= 0) {
        return res.redirect('/cart');
      }
      
      let cart = req.session.cart;
      const itemIndex = cart.items.findIndex(item => item.product.id == productId);
      
      if (itemIndex > -1) {
        // Actualizar cantidad
        cart.items[itemIndex].quantity = quantity;
        
        // Recalcular totales
        cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        );
        
        req.session.cart = cart;
      }
      
      res.redirect('/cart');
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al actualizar el carrito'
      });
    }
  },

  // Eliminar un producto del carrito
  removeCartItem: (req, res) => {
    try {
      const productId = req.body.productId;
      let cart = req.session.cart;
      
      // Filtrar el item a eliminar
      cart.items = cart.items.filter(item => item.product.id != productId);
      
      // Recalcular totales
      cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
      );
      
      req.session.cart = cart;
      
      res.redirect('/cart');
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al eliminar del carrito'
      });
    }
  }
};

module.exports = cartController;