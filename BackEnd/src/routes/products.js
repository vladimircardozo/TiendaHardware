import express from 'express';
import productModel from  '../dao/models/product.models.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const { limit = 10, page = 1, sort, query, availability } = req.query;

        console.log('Limit:', limit);

        let filter = {};
        
        if(query) {
             
            filter.$or = [
                {category: {$regex: query, $options: 'i'}},
                {title: {$regex: query, $options: 'i'}}
            ]
          };

          if (availability) {
            filter.stock = availability === 'true' ? { $gt: 0 } : 0; // Productos disponibles o no
          }
        
        
        let sortOptions =  {};
        if (sort) {
            // Si 'sort' es 'asc', ordenar en orden ascendente; si es 'desc', en orden descendente
            sortOptions.price = sort === 'asc' ? 1 : -1;
        }

        // Realizar la búsqueda con paginación y posible ordenamiento
        const products = await productModel
        .find(filter)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip((parseInt(page) -1) * parseInt(limit)) // Saltar los productos de páginas anteriores
        .lean();

        const totalProducts = await productModel.countDocuments(filter); // total de productos que coinciden con el filtro
        const totalPages = Math.ceil(totalProducts / parseInt(limit)); // Calcular el total de páginas

        //Enlaces previos al siguente 
        const prevPage = parseInt(page) > 1 ? parseInt(page) - 1 : null
        const nextPage = parseInt(page) < totalPages ? parseInt(page) + 1 : null;
        const prevLink = prevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}&availability=${availability}`  : null;
        const nextLink =  nextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}&availability=${availability}` : null;


        res.json({
            status: 'success',
            payload: products,
            totalProducts,
            totalPages,
            page: parseInt(page),
            hasPrevPage: prevPage !==  null,
            hasNextPage: nextPage !== null,
            prevPage,
            nextPage,
            prevLink,
            nextLink
        });

    } catch  (err) {
        res.status(500).json({message: 'Error al obtener los productos', error: err})
    }
});

// TODO: Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el producto por ID
        const product = await productModel.findById(id);

        if (product) {
            res.json(product); // Devolver el producto encontrado
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: 'Error al obtener el producto', error: err });
    }
});

//TODO: Ruta para agregar productos
router.post('/', async (req, res) => {
    const { title, price, stock, description, image, category, code } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!title ||  !price || !stock || !description || !category  || !code) {


        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si ya existe un producto con el mismo código
    const existingProduct = await productModel.findOne({ code });
    if (existingProduct) {
        return res.status(409).json({ message: 'El código del producto ya existe.' });
    }

    // Crear un nuevo producto usando el modelo de Mongoose
    const newProduct = new productModel({
        title,
        price,
        stock,
        description,
        image,
        category,
        code
    });

    try {
        const createdProduct = await newProduct.save(); // Guardar el nuevo producto en la base de datos
        res.status(201).json(createdProduct); // Devuelve el nuevo producto creado
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar el producto', error: err });
    }
});

// TODO: Ruta para actualizar un producto
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtenemos el ID del producto de los parámetros de la URL
    const { title, price, stock, description, image, category, code } = req.body; // Extraemos los campos del cuerpo de la solicitud

    // Verificar si todos los campos requeridos están presentes
    if (!title ||  !price || !stock || !description || !category   || !code) {


        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Actualizar el producto en la base de datos por su ID
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { title, stock, price, description, image, category,  code },

            { new: true } // Opción `new: true` para devolver el producto actualizado
        );

        // Si el producto no se encuentra
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Devolver el producto actualizado
        res.json(updatedProduct);
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: 'Error al actualizar el producto', error: err });
    }
});

//TODO: Ruta para eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (deletedProduct) {
            res.status(200).json({message: 'Producto eliminado exitosamente'});
        } else {
            res.status(404).json({message: 'Producto no encontrado'});
        }
    } catch (err) {
        res.status(500).json({message: 'Error al eliminar el producto', error: err});
    }
});

export default router;