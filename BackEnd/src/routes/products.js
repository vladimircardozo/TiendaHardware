import express from 'express';
import fs from  'fs';
import path from 'path';

const router = express.Router();
const filePath = path.join(process.cwd(), 'data', 'productos.json');

//TODO: Función auxiliar para leer productos desde un archivo
const leerProductosDesdeArchivo = () => {
    try {
        const data = fs.readFileSync(filePath,  'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return[];
    }
}

//TODO:  Función auxiliar para escribir productos en un archivo
const escribirProductosEnArchivo = (products) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error('Error al escribir en el archivo:', err);
    }
};

router.get('/', (req, res) => {
    const products = leerProductosDesdeArchivo();
    const productId = parseInt(req.params.pid, 10);
    const product =  products.find((product) => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }

})

//TODO: Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const products = leerProductosDesdeArchivo();
    const productId = parseInt(req.params.pid, 10);
    const product = products.find((product) => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

//TODO: Ruta para agregar productos
router.post('/',  (req, res) => {
    const products  = leerProductosDesdeArchivo();
    const {nombre, descripcion, code, precio, stock, categoria, imagen = []} = req.body;

    if (!nombre || !descripcion || !code || !precio || !stock || !categoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.'})
    }

    // Generar un nuevo ID
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
        id: newId,
        nombre,
        descripcion,
        code,
        precio,
        status: true,
        stock,
        categoria,
        imagen
    };

    // Agregar el nuevo producto a la lista
    products.push(newProduct);
    escribirProductosEnArchivo(products)
    res.status(201).json(newProduct); // Devuelve el nuevo producto creado

})

//TODO: Ruta para actualizar un producto 
router.put('/:pid', (req, res) => {
    const products  = leerProductosDesdeArchivo();
    const productId = parseInt(req.params.pid, 10);
    const  productIndex = products.findIndex(product => product.id === productId);
    
    if(productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const {nombre, descripcion, code, precio, stock, categoria, imagen = []} = req.body;

    if (!nombre || !descripcion || !code ||  !precio || !stock || !categoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.'});
    }

    products[productIndex] = {
        ...products[productIndex], // Mantener las propiedades existentes que no cambian
        nombre,
        descripcion,
        code,
        precio,
        stock,
        categoria,
        imagen
    };

    escribirProductosEnArchivo(products);
    res.json(products[productIndex]); // Devolver el producto actualizado

});

//TODO: Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const products  = leerProductosDesdeArchivo();
    const productId = parseInt(req.params.pid, 10);
    const index = products.findIndex(product => product.id === productId);

    if (index > -1) {
        products.splice(index, 1); // Elimina el producto
        escribirProductosEnArchivo(products);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


export default router;