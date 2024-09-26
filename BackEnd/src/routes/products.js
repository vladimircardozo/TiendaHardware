import express from 'express';

const router = express.Router();

const products = [
    { id: 1, title: 'Product 1', description: 'Description 1', code: 'P1', price: 100, status: true, stock: 50, category: 'Category 1' },
    { id: 2, title: 'Product 2', description: 'Description 2', code: 'P2', price: 200, status: true, stock: 30, category: 'Category 2' },
    { id: 3, title: 'Product 3', description: 'Description 3', code: 'P3', price: 300, status: true, stock: 20, category: 'Category 3' },
];

// Ruta para obtener todos los productos, con opción de límite
//!: NO FUNCIONA, ARREGLAR
router.get('/', (req, res) => {
    const { limit } = req.query; // Obtener el parámetro de consulta 'limit'
    
    const limitNumber = limit ? parseInt(limit, 10) : products.length;

    const responseProducts = products.slice(0, limitNumber);
    res.json(responseProducts);
});

// Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const product = products.find(product => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

router.post('/',  (req, res) => {
    const {title, description, code, price, stock, category, thumbnails = []} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.'})
    }

    // Generar un nuevo ID
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };

    // Agregar el nuevo producto a la lista
    products.push(newProduct);
    res.status(201).json(newProduct); // Devuelve el nuevo producto creado

})

// Ruta para actualizar un producto 
//!: NO FUNCIONA, ARREGLAR
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const  product = products.find(product => product.id === productId);

    if(product === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const {title, description, code, price, stock, category, thumbnails = []} = req.body;

    if (!title || !description || !code ||  !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.'});
    }

    products[product].title = title;
    products[product].description = description;
    products[product].code = code;
    products[product].price = price;
    products[product].stock = stock;
    products[product].category = category;
    products[product].thumbnails = thumbnails;

    res.json(products[product])

});

// Ruta para eliminar un producto por ID
//!: NO FUNCIONA, ARREGLAR
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const index = products.find(product => product.id === productId);

    if (index > -1) {
        products.splice(index, 1); // Elimina el producto
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});



export default router;