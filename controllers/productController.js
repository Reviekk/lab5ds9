// controllers/productController.js
const { Product } = require('../models');

const productController = {
  // Método para mostrar la página de inicio con productos destacados
  getHomePage: async (req, res) => {
    try {
      // Obtener algunos productos destacados (primeros 3)
      const featuredProducts = await Product.findAll({ limit: 3 });
      
      res.render('index', { 
        title: 'Inicio',
        featuredProducts 
      });
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      res.status(500).render('error', { 
        title: 'Error',
        message: 'Error al cargar la página de inicio' 
      });
    }
  },

  // Método para mostrar todos los productos
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      console.log(products);
      res.render('products', { 
        title: 'Productos',
        products 
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).render('error', { 
        title: 'Error',
        message: 'Error al cargar los productos' 
      });
    }
  },

  // Método para mostrar un producto por su ID
  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).render('404', { title: 'Producto no encontrado' });
      }
      
      res.render('product-detail', { 
        title: product.name,
        product 
      });
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).render('error', { 
        title: 'Error',
        message: 'Error al cargar el producto' 
      });
    }
  }
};

module.exports = productController;