// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false  // Desactiva los logs de SQL para mayor claridad
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente');
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
  }
};

// Ejecutamos la prueba de conexión
testConnection();

// Exportamos la instancia para usarla en otros archivos
module.exports = sequelize;