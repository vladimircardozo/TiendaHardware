import express from 'express';
const router = express.Router();

const carts = [];

router.get('/', (req, res) => res.json(carts));
router.post('/', (req, res) => {
    const newCart = req.body;
    carts.push(newCart);
    res.status(201).json(newCart);
});

export default router