import express from "express";
import cartsManager from "../../data/mongo/managers/carts.manager.js";

const router = express.Router();

router.get("/:cid", async (req, res, next) => {
    try {
        const cart = await cartsManager.getCartById(req.params.cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        return next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const newCart = await cartsManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        return next(error);
    }
});

router.post("/:cid/products/:pid", async (req, res, next) => {
    try {
        const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
});

router.delete("/:cid", async (req, res, next) => {
    try {
        await cartsManager.clearCart(req.params.cid);
        res.status(200).json({ message: "Carrito eliminado" })
    } catch (error) {
        return next(error);
    }
})

router.delete("/:cid/products/:pid", async (req, res, next) => {
    try {
      const cart = await cartsManager.removeProductFromCart(req.params.cid, req.params.pid);
      res.status(200).json(cart);
    } catch (error) {
        return next(error);
    }
  });

router.put("/:cid", async (req, res, next) => {
    try {
        const updatedCart = await cartsManager.updateCart(req.params.cid, req.body.products);
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(400).json({ message: "Carrito no encontrado" })
        }
    } catch (error) {
        return next(error);
    }
});

router.put('/:cid/products/:pid', async (req, res, next) => {
    try {
        const updatedCart = await cartsManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        return next(error);
    }
})

export default router;