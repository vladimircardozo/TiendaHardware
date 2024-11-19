import "dotenv/config.js"
import express from 'express';
import morgan from "morgan";
import cookieParser from "cookie-parser"
import MongoStore from "connect-mongo";
import { create } from 'express-handlebars';
import { Server as socketIOserver } from 'socket.io';
import http from 'http';
import path from 'path';
import Product from './data/mongo/models/product.model.js';
import pathHandler from "./middlewares/pathHandler.mid.js";
import errorHandler from "./middlewares/errorHandler.mid.js";
import appRouter from "./routes/app.router.js";
import sessionsRouter from "./routes/api/sessions.api.js"
import dbConnect from "./utils/dbconnect.util.js";
import setupSocket from "./utils/socket.util.js";
import session from "express-session";

//server
const port = process.env.PORT

const app = express();
const server = http.createServer(app); // Crea un servidor HTTP
const io = new socketIOserver(server); // Inicializa Socket.IO con el servidor

// Middleware
app.use(express.json()); //analizar JSON
app.use(express.urlencoded({ extended: true })); //analizar cuerpos URL-encoded
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24, // Tiempo de vida de las sesiones (24 horas)
    })
}));

//routers 
app.use("/api/sessions", sessionsRouter);
app.use("/", appRouter);
app.use(errorHandler);
app.use(pathHandler);

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


// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(process.cwd(), 'public')));

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

// Configuración de Socket.IO en un archivo externo
setupSocket(io);

dbConnect()
    .then(() => {
        console.log("Conectado a la base de datos");
        server.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    });