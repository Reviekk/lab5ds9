// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

const { Product, Order, OrderItem } = require('./models');

// Importamos rutas (las crearemos más adelante)
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hora
}));

// Middleware para inicializar carrito en sesión
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0
    };
  }
  // Pasar datos del carrito a todas las vistas
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

// Rutas
app.use('/', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
// app.use('/products', productRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Sincronizamos la base de datos (sin force para no perder datos)
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });