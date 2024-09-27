import express from 'express';
const router = express.Router();

const carts = [
  {
    id: 1,
    products: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  },
  {
    id: 2,
    products: [
      { productId: 3, quantity: 4 },
      { productId: 1, quantity: 1 },
    ],
  },
];

//TODO: Ruta para obtener los datos de un carrito por su ID
router.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const cart = carts.find((c) => c.id === cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

//TODO: Ruta para agregar un nuevo carrito
router.post('/', (req, res) => {
  // Generar un nuevo ID
  const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

  const newCart = {
    id: newId,
    products: [], // Inicializa con un array vacío de productos
  };

  // Agregar el nuevo carrito a la lista
  carts.push(newCart);

  res.status(201).json(newCart); // Devuelve el nuevo carrito creado
});

//TODO: Ruta  para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const cart = carts.find(c => c.id === cartId);

    if(!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productInCart = cart.products.find(p => p.productId ===  productId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ productId, quantity: 1 });
    }

    res.status(200).json(cart);

});

export default router;
