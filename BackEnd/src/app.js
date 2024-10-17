import express from 'express';
import { create } from 'express-handlebars';
import { Server as socketIOserver } from 'socket.io';
import http from 'http';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import path from 'path';
import { promises as fs } from 'fs';

const PORT = 8080;
const app = express();
const server = http.createServer(app); // Crea un servidor HTTP
const io = new socketIOserver(server); // Inicializa Socket.IO con el servidor

// Configuración del motor Handlebars
const hbs = create({
    extname: '.handlebars',
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
    const filePath = path.join(process.cwd(), 'data', 'productos.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(data); // Intenta parsear los datos JSON
        res.render('index', { products }); // Renderiza la vista con los productos
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ message: 'Error al cargar productos', error: err.message });
    }
});

// Ruta para mostrar productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'productos.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(data);
        res.render('realTimeProducts', { products });
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ message: 'Error al cargar productos', error: err.message });
    }
});

// Configuración de Socket.IO
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos en tiempo real cuando un nuevo cliente se conecta
    const filePath = path.join(process.cwd(), 'data', 'productos.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(data);
        socket.emit('actualizarProductos', products);
    } catch (err) {
        console.error('Error al leer los productos:', err);
    }

    // Escuchar la eliminación de productos
    socket.on('deleteProduct', async (productId) => {
        console.log('Producto eliminado con ID:', productId); // Verifica el ID que llega
        try {
            const data = await fs.readFile(filePath, 'utf8');
            let products = JSON.parse(data);
            products = products.filter((product) => product.id !== parseInt(productId));

            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            io.emit('actualizarProductos', products);
        } catch (err) {
            console.error('Error al eliminar producto:', err);
        }
    });

    // Escuchar la adición de nuevos productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const products = JSON.parse(data);

            // Generar un nuevo ID único
            const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const productToAdd = { id: newId, ...newProduct, status: true };

            products.push(productToAdd);

            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
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
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
