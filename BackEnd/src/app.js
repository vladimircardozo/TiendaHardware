import express from 'express';
import { create } from 'express-handlebars';
import { Server as socketIOserver } from 'socket.io';
import http from 'http';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import path from 'path';
import mongoose from 'mongoose';
import Product from './dao/models/product.models.js';

const PORT = 8080;
const app = express();
const server = http.createServer(app); // Crea un servidor HTTP
const io = new socketIOserver(server); // Inicializa Socket.IO con el servidor
const MONGODB_URI=  'mongodb+srv://coder70275:coder2024@vcardozo.kqs8k.mongodb.net/coder70275'

// Configuración del motor Handlebars
const hbs = create({
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite acceder a las propiedades del prototipo
        allowProtoMethodsByDefault: true     // Permite acceder a los métodos del prototipo
    }
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(process.cwd(), 'src/views'));

// Middleware para analizar JSON y cuerpos URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para mostrar productos en la vista Handlebars
app.get('/products', async (req, res) => {
    try{
        const products = await  Product.find();
        res.render('index', {products});
    } catch(err) {
        console.error('Error al cargar los productos desde la base de datos:', err)
        return res.status(500).json({ message: 'Error al cargar productos', error: err.message })
    }
});

// Ruta para mostrar productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products })
    } catch (err) {
        console.error('Error al cargar los productos desde la base de datos:', err);
        return res.status(500).json({ message: 'Error al cargar productos', error: err.message})
    }
});

// Ruta para mostrar detalles de un producto específico
app.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.render('productDetail',  { product });
    } catch (err) {
        console.error('Error al cargar el producto', err);
        return res.status(500).json({ message: 'Error al cargar producto', error: err})
    }
});

// Configuración de Socket.IO
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    try {
        const  products = await Product.find();
        socket.emit('actualizarProductos', products);
    } catch (err) {
        console.error('Error al obtener productos:', err);
    }

    // Eliminar productos
    socket.on('deleteProduct', async (productId) => {
        try{
            await Product.findByIdAndDelete(productId);
            const products = await Product.find();
            io.emit('actualizarProductos', products);
        } catch (err) {
            console.error('Error al eliminar productos:', err);
        }
    });

    // Escuchar la adición de nuevos productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const productToAdd = new Product(newProduct);
            await productToAdd.save(); // Guarda el nuevo producto en MongoDB
            const products = await Product.find(); // Consulta productos actualizados
            io.emit('actualizarProductos', products);
        } catch (err) {
            console.error('Error al añadir producto:', err);
        }
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor en el puerto especificado
server.listen(PORT, async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Servidor escuchando en el puerto ${PORT} conectado a bbdd`);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
});
