import express from 'express';
import Cart from '../dao/models/carts.models.js'
import mongoose from 'mongoose';
import product from '../dao/models/product.models.js'

const router = express.Router();


//TODO: Ruta para obtener los datos de un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId');
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' })
    }

  }catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
});

//TODO: Ruta para agregar un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = new Cart();
  try {
    const savedCart = await  newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//TODO: Ruta  para agregar un producto a un carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
    return res.status(400).json({ message: 'ID invalido para cart o product' });
}

  try {
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

      const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);

      if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId: pid, quantity: 1, name: product.name, price: product.price });

      }
      await cart.save();
      res.status(200).json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito', error);

      res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
  }
});

//TODO: api/carts/:cid - Eliminar todos los productos del carrito especificado
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    } 

    cart.products = [];
    await cart.save();

    res.status(200).json({ message:  'Productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar los productos del carrito', error });
  }
} )


//TODO: Ruta para eliminar un producto de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' })

      const productExists = cart.products.some(p => p.productId.toString() === pid);
    if (!productExists) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

      cart.products = cart.products.filter(p =>  p.productId.toString() !== pid);
      await cart.save();
      res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

//TODO: ruta para actualizar un carrito
router.put('/:cid', async (req, res) => {
  const  { cid } = req.params;
  const { products } = req.body;
  try {
    const updatedCart = await  Cart.findByIdAndUpdate(cid, { products }, { new: true });

    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const  { cid, pid } = req.params;
  const { quantity } = req.body; 

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cid, "products.productId": pid },
      { $set:  { "products.$.quantity": quantity } },
      { new: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }


    res.status(200).json(updatedCart)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
  }
});

export default router;
