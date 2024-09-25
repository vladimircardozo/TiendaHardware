import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const PORT = 8080;
const app = express()

app.use(express.json()); // Para analizar cuerpos JSON
app.use(express.urlencoded({ extended: true })); // Para analizar cuerpos URL-encoded

app.use('/api/products',  productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});