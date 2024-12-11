import CustomRouter from "../../utils/CustomRouter.util.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import verifyToken from "../../middlewares/verifyToken.mid.js";
import isAdmin from "../../middlewares/isAdmin.mid.js";
import { handleCreate, handleRead, handleReadById, handleUpdate, handleDestroy } from "../../controllers/products.controller.js"

class ProductsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.create("/", ["ADMIN"], verifyToken, isAdmin, handleCreate);
        this.read("/", ["PUBLIC"], handleRead);
        this.read("/:id", ["PUBLIC"], handleReadById);
        this.update("/:id", ["ADMIN"], passportCb("admin"), handleUpdate);
        this.destroy("/:id", ["ADMIN"], passportCb("admin"), handleDestroy);
    }

}

export default new ProductsApiRouter().getRouter();
