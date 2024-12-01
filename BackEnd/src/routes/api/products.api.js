import CustomRouter from "../../utils/CustomRouter.util.js";
import { read, create, update, destroy, readById } from "../../data/mongo/managers/products.manager.js";
import { ObjectId } from "mongodb";

class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
this.create("/", async (req, res) => {
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
});

this.read("/", async (req, res) => {
        const { limit = 10, page = 1, sort, query, availibility} = req.query;
        const message = "PRODUCTS FOUND";
        const response = await read({ limit, page, sort, query, availibility })
        return res.status(200).json(response, message);
});

this.read("/:id", async (req, res) => {

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
});

this.update("/:id", async (req, res) => {
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
});

this.destroy("/:id", async (req, res) => {
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
});
    }
}

export default new ProductsApiRouter().getRouter();