// models/index.js
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Una orden tiene muchos items
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

// Un item de orden pertenece a un producto
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = {
  Product,
  Order,
  OrderItem
};