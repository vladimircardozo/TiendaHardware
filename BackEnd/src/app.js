import express from 'express';
import { create } from 'express-handlebars';
import { Server as socketIOserver } from 'socket.io';
import http from 'http';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import path from 'path';
import fs from 'fs';

const PORT = 8080;
const app = express();
const server = http.createServer(app); // Crea un servidor HTTP
const io = new socketIOserver(server); // Inicializa Socket.IO con el servidor

// Configuración del motor Handlebars
const hbs = create({
    extname: '.handlebars',
});

app.engine('.handlebars',  hbs.engine);
app.set('view engine',  '.handlebars');
app.set('views', path.join(process.cwd(),  'views'));

// Middleware para analizar JSON y cuerpos URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas
app.use('/api/products',  productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para mostrar productos en la vista Handlebars
app.get('/products', (req, res) => {
    const filePath = path.join(process.cwd(), 'data', 'productos.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err); 
            return res.status(500).json({ message: 'Error al cargar productos', error: err.message });
        }
        try {
            const products = JSON.parse(data); // Intenta parsear los datos JSON
            res.render('index', { products }); // Renderiza la vista con los productos
        } catch (parseError) {
            console.error('Error al analizar JSON:', parseError);
            return res.status(500).json({ message: 'Error al cargar productos', error: parseError.message });
        }
    });
});



// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Recibir mensajes del cliente
    socket.on('message', (data) => {
        console.log('Mensaje recibido:', data);
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
