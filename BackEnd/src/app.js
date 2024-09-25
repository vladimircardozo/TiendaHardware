import express from 'express';

const PORT = 8080;
const app = express()

app.use(express.json()); // Para analizar cuerpos JSON
app.use(express.urlencoded({ extended: true })); // Para analizar cuerpos URL-encoded

app.get('/api/products/', (req, res) => {
    res.send('Listar todos los productos')
});

app.get('/api/products/:pid', (req, res) => {
    const productId = req.params.pid;
    res.send(`Mostrar producto con id ${productId}`);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchado en el puerto ${PORT}`)
});