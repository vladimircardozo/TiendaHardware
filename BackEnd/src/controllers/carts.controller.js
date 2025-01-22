import {
  createService,
  readService,
  updateService,
  destroyService,
} from '../services/carts.service.js';
import { ObjectId } from 'mongodb';

async function handleGetCartById(req, res) {
  const { cid } = req.params;

  if (!ObjectId.isValid(cid)) {
    return res.status(400).json({ message: 'ID de carrito inválido' });
  }

  try {
    const cart = await readService(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
}

async function handleCreateCart(req, res) {
  try {
    const newCart = await createService(req.body);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });
  }
}

async function handleAddProductToCart(req, res) {
  const { cid, pid } = req.params;

  if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ message: 'ID de carrito o producto inválido' });
  }

  try {
    const cart = await updateService(cid, { action: 'add', productId: pid });
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al agregar producto al carrito', error });
  }
}

async function handleClearCart(req, res) {
  const { cid } = req.params;

  if (!ObjectId.isValid(cid)) {
    return res.status(400).json({ message: 'ID de carrito inválido' });
  }

  try {
    await destroyService(cid);
    res.status(200).json({ message: 'Carrito eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito', error });
  }
}

async function handleRemoveProductFromCart(req, res) {
  const { cid, pid } = req.params;

  if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ message: 'ID de carrito o producto inválido' });
  }

  try {
    const cart = await updateService(cid, { action: 'remove', productId: pid });
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar producto del carrito', error });
  }
}

async function handleUpdateCart(req, res) {
  const { cid } = req.params;
  const { products } = req.body;

  if (!ObjectId.isValid(cid)) {
    return res.status(400).json({ message: 'ID de carrito inválido' });
  }

  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ message: 'El formato de productos es inválido' });
  }

  try {
    const updatedCart = await updateService(cid, {
      action: 'updateCart',
      products,
    });
    if (updatedCart) {
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
}

async function handleUpdateProductQuantity(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ message: 'ID de carrito o producto inválido' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res
      .status(400)
      .json({ message: 'La cantidad debe ser un número mayor a 0' });
  }

  try {
    const updatedCart = await updateService(cid, {
      action: 'updateQuantity',
      productId: pid,
      quantity,
    });
    if (updatedCart) {
      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar la cantidad del producto', error });
  }
}

export {
  handleGetCartById,
  handleCreateCart,
  handleAddProductToCart,
  handleClearCart,
  handleRemoveProductFromCart,
  handleUpdateCart,
  handleUpdateProductQuantity,
};