 // models/Product.js - Modelo para los productos de la tienda
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta es correcta

const Product = sequelize.define('Product', {
    // Campo ID: clave primaria autoincremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true  // ¡Corregido! Ahora está dentro del objeto "id".
    },
    // Nombre del producto (obligatorio)
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Descripción del producto (opcional)
    description: {
        type: DataTypes.TEXT
    },
    // Precio del producto (obligatorio)
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // Cantidad en inventario (default: 0)
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // URL de la imagen del producto (opcional)
    imageUrl: {
        type: DataTypes.STRING
    }
});  // Llave de cierre correctamente ubicada

module.exports = Product;