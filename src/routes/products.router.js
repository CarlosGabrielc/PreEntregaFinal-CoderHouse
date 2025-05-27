import express from 'express';
import { Product } from '../models/Product.js';
import products from '../data/products.js';
const router = express.Router();

// GET /api/products?limit=&page=&query=&sort=
router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      query,
      sort // puede ser "asc" o "desc"
    } = req.query;

    const filters = {};
    if (query) {
      // Puede ser categoría o status
      if (query === 'true' || query === 'false') {
        filters.status = query === 'true';
      } else {
        filters.category = query;
      }
    }

    const sortOptions = {};
    if (sort === 'asc') sortOptions.price = 1;
    else if (sort === 'desc') sortOptions.price = -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions
    };

    const result = await Product.paginate(filters, options);

    const { docs, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort || ''}&query=${query || ''}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort || ''}&query=${query || ''}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;