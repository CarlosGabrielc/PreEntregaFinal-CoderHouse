// routes/carts.router.js
import express from 'express';
// import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

const router = express.Router();

// GET /api/carts/:cid => Mostrar carrito con productos populados
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid → Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid → Reemplazar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // [{ product: id, quantity: n }]

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado completamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid → Modificar SOLO la cantidad del producto
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid → Vaciar todo el carrito
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
