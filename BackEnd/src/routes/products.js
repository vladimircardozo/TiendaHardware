import express from  'express';

const router = express.Router();

const products = [
    {id: 1, name:  'Product 1', price: 100 },
    { id: 2, name: 'Producto 2', price: 200 },
    { id: 3, name: 'Producto 3', price: 300 },
]

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const product = products.find(product => product.id === productId);

    if(product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


export default router;