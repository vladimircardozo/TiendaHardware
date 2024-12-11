import { read, create, update, destroy, readById } from "../data/mongo/managers/products.manager.js";
import { ObjectId } from "mongodb";

async function handleCreate(req, res) {
    const { title, price, stock, description, category, code } = req.body;

    if (!title || !price || !stock || !description || !category || !code) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const existingProduct = await read({ code });
    if (existingProduct.length && existingProduct.length > 0) {
        return res.status(400).json({ message: "El producto ya existe." });
    }

    const data = { title, price, stock, description, category, code };
    const message = "PRODUCT CREATED";
    const response = await create(data);
    return res.json201(response, message);
}

async function handleRead(req, res) {
    const { limit = 10, page = 1, sort, query, availibility } = req.query;
    const message = "PRODUCTS FOUND";
    const response = await read({ limit, page, sort, query, availibility });
    return res.json200(response, message);
}

async function handleReadById(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.json404();
    }

    const response = await readById(id);
    if (!response) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    const message = "PRODUCT FOUND";
    return res.json200(response, message);
}

async function handleUpdate(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!ObjectId.isValid(id)) {
        return res.json404();
    }

    const response = await update(id, data);
    if (!response) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    const message = "PRODUCT UPDATED";
    return res.json200(response, message);
}

async function handleDestroy(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.json404();
    }

    const response = await destroy(id);
    if (!response) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    const message = "PRODUCT DELETED";
    return res.json200(response, message);
}

export { handleCreate, handleRead, handleReadById, handleUpdate, handleDestroy }