import CustomRouter from "../../utils/CustomRouter.util.js";
import { read, create, update, destroy, readById } from "../../data/mongo/managers/products.manager.js";
import { ObjectId } from "mongodb";
import passportCb from "../../middlewares/passportCb.mid.js";
import verifyToken from "../../middlewares/verifyToken.mid.js";
import isAdmin from "../../middlewares/isAdmin.mid.js";

class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
this.create("/", ["ADMIN"], verifyToken, isAdmin, async (req, res) => {
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
        return res.json201(response, message);
});

this.read("/", ["PUBLIC"], async (req, res) => {
        const { limit = 10, page = 1, sort, query, availibility} = req.query;
        const message = "PRODUCTS FOUND";
        const response = await read({ limit, page, sort, query, availibility })
        return res.json200(response, message);
});

this.read("/:id", ["PUBLIC"], async (req, res) => {

        const { id } = req.params;
        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.json404();
        }

        const response = await readById(id);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.json200(response, message);
});

this.update("/:id", ["ADMIN"], passportCb("admin"), async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.json404();
        }

        const response = await update(id, data);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.json200(response, message);
});

this.destroy("/:id", ["ADMIN"], passportCb("admin"), async (req, res) => {
        const { id } = req.params;

        // Validar el formato del ID
        if (!ObjectId.isValid(id)) {
            return res.json404();
        }

        const response = await destroy(id);
        if (!response) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.json200(response, message);
});
    }
}

export default new ProductsApiRouter().getRouter();