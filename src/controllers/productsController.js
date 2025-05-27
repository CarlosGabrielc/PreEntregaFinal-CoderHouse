
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    // Parámetros query
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort; 
    const query = req.query.query;

    // Construcción del filtro para Mongo
    let filter = {};
    if (query) {
      // Suponemos que query puede ser por categoría o por disponibilidad (disponible: true/false)
      if (query === 'disponible') {
        filter = { available: true };
      } else if (query === 'no-disponible') {
        filter = { available: false };
      } else {
        // filtro por categoría (asumiendo que 'category' es campo en modelo)
        filter = { category: query };
      }
    }

    // Construcción de ordenamiento
    let sortOption = {};
    if (sort === 'asc') {
      sortOption = { price: 1 };
    } else if (sort === 'desc') {
      sortOption = { price: -1 };
    }

    // Consulta paginada usando mongoose paginate (si usás un plugin) o manual
    // Supongamos que no usás plugin, hacemos paginación manual
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    
    const baseLink = `/api/products?limit=${limit}&sort=${sort || ''}&query=${query || ''}`;

    res.json({
      status: "success",
      payload: products,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `${baseLink}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `${baseLink}&page=${page + 1}` : null,
    });
    

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getProducts };