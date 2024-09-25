import express from 'express';
import productsRouter from './routes/products'

const PORT = 8080;
const app = express()

app.use(express.json()); // Para analizar cuerpos JSON
app.use(express.urlencoded({ extended: true })); // Para analizar cuerpos URL-encoded

app.use('/api/products',  productsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});