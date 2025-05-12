require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");

const { Product, Order, OrderItem } = require("./models");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const webhookRoutes = require("./routes/webhook");

const app = express();
const port = process.env.PORT || 3000;

// Inicializar Stripe antes de usarlo en cualquier ruta
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.locals.stripe = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
};

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración del layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// ⚠️ La ruta de webhook debe ir antes del bodyParser (requerido por Stripe)
app.use('/webhook', webhookRoutes);

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

// Middleware para carrito en sesión
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0,
    };
  }
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

// Rutas principales

app.use("/", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

// Página 404
app.use((req, res) => {
  res.status(404).render("404", { title: "Página no encontrada" });
});

// Base de datos y servidor
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
