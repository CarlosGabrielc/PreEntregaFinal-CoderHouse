import { Router } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    const filter = {};
    if (query) {
      if (query === 'disponibles') {
        filter.status = true;
      } else {
        filter.category = query;
      }
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    const result = await Product.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true,
    });

    res.render('products', {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    });
  } catch (err) {
    res.status(500).send('Error al obtener productos.');
  }
});

export default router;