import { Router } from "express";
import { read, create, update, destroy, readById } from "../../data/mongo/managers/products.manager.js";
import { ObjectId } from "mongodb";

const ProductsApiRouter = Router();

ProductsApiRouter.post("/", async (req, res, next) => {
    try {
        const {title, price, stock, description, category, code } = req.body;
        if (!title || !price || !stock || !description || !category || !code) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const existingProduct = await read({ code });
        if (existingProduct.length && existingProduct.length > 0) {
            return res.status(400).json({ message: "El producto ya existe." });
        }

        const data = { title, price, stock, description, category, code };
        const message = "PRODUCT CREATED"
        const response = await create(data);
        return res.status(201).json({ response, message })
    } catch (error) {
        return next(error);
    }
});

ProductsApiRouter.get("/", async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query, availibility} = req.query;
        const message = "PRODUCTS FOUND";
        const response = await read({ limit, page, sort, query, availibility })
        return res.status(200).json(response, message);
    } catch (error) {
        return next(error);
    }
});

ProductsApiRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const response = await readById(id);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
});

ProductsApiRouter.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const response = await update(id, data);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json({ response, message: "PRODUCT UPDATED" });
    } catch (error) {
        return next(error);
    }
});

ProductsApiRouter.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const response = await destroy(id);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json({ response, message: "PRODUCT DELETED" });
    } catch (error) {
        return next(error);
    }
});

export default ProductsApiRouter