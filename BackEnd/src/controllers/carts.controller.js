import cartsManager from "../data/mongo/managers/carts.manager.js";
import { ObjectId } from "mongodb";

async function handleGetCartById(req, res) {
    const { cid } = req.params;

    if (!ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }

    const cart = await cartsManager.getCartById(cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: "Carrito no encontrado" });
    }
}

async function handleCreateCart(req, res) {
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);
}

async function handleAddProductToCart(req, res) {
    const { cid, pid } = req.params;

    if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto inválido" });
    }

    const cart = await cartsManager.addProductToCart(cid, pid);
    res.status(200).json(cart);
}

async function handleClearCart(req, res) {
    const { cid } = req.params;

    if (!ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }

    await cartsManager.clearCart(cid);
    res.status(200).json({ message: "Carrito eliminado" });
}

async function handleRemoveProductFromCart(req, res) {
    const { cid, pid } = req.params;

    if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto inválido" });
    }

    const cart = await cartsManager.removeProductFromCart(cid, pid);
    res.status(200).json(cart);
}

async function handleUpdateCart(req, res) {
    const { cid } = req.params;
    const { products } = req.body;

    if (!ObjectId.isValid(cid)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: "El formato de productos es inválido" });
    }

    const updatedCart = await cartsManager.updateCart(cid, products);
    if (updatedCart) {
        res.status(200).json(updatedCart);
    } else {
        res.status(404).json({ message: "Carrito no encontrado" });
    }
}

async function handleUpdateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
        return res.status(400).json({ message: "ID de carrito o producto inválido" });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número mayor a 0" });
    }

    const updatedCart = await cartsManager.updateProductQuantity(cid, pid, quantity);
    if (updatedCart) {
        res.status(200).json(updatedCart);
    } else {
        res.status(404).json({ message: "Carrito o producto no encontrado" });
    }
}

export { handleGetCartById, handleCreateCart, handleAddProductToCart, handleClearCart, handleRemoveProductFromCart, handleUpdateCart, handleUpdateProductQuantity }