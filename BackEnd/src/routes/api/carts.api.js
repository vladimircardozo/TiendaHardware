import CustomRouter from "../../utils/CustomRouter.util.js";
import cartsManager from "../../data/mongo/managers/carts.manager.js";
import { ObjectId } from "mongodb";

class CartsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
        // Obtener un carrito por ID
        this.read("/:cid", async (req, res) => {
                const { cid } = req.params;

                // Validar formato de ID
                if (!ObjectId.isValid(cid)) {
                    return res.status(400).json({ message: "ID de carrito inválido" });
                }

                const cart = await cartsManager.getCartById(cid);
                if (cart) {
                    res.json(cart);
                } else {
                    res.status(404).json({ message: "Carrito no encontrado" });
                }
        });

        // Crear un nuevo carrito
        this.create("/", async (req, res) => {
                const newCart = await cartsManager.createCart();
                res.status(201).json(newCart);
        });

        // Agregar un producto a un carrito
        this.create("/:cid/products/:pid", async (req, res) => {
                const { cid, pid } = req.params;

                if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
                    return res.status(400).json({ message: "ID de carrito o producto inválido" });
                }

                const cart = await cartsManager.addProductToCart(cid, pid);
                res.status(200).json(cart);
        });

        // Vaciar un carrito
        this.destroy("/:cid", async (req, res) => {
                const { cid } = req.params;

                if (!ObjectId.isValid(cid)) {
                    return res.status(400).json({ message: "ID de carrito inválido" });
                }

                await cartsManager.clearCart(cid);
                res.status(200).json({ message: "Carrito eliminado" });
        });

        // Eliminar un producto de un carrito
        this.destroy("/:cid/products/:pid", async (req, res) => {
                const { cid, pid } = req.params;

                if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
                    return res.status(400).json({ message: "ID de carrito o producto inválido" });
                }

                const cart = await cartsManager.removeProductFromCart(cid, pid);
                res.status(200).json(cart);
        });

        // Actualizar un carrito completo
        this.update("/:cid", async (req, res) => {
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
        });

        // Actualizar la cantidad de un producto en un carrito
        this.update("/:cid/products/:pid", async (req, res) => {
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
        });
    }
}

const cartsApiRouter = new CartsApiRouter();
export default cartsApiRouter.getRouter();
