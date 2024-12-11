import CustomRouter from "../../utils/CustomRouter.util.js";
import { handleGetCartById, handleCreateCart, handleAddProductToCart, handleClearCart, handleRemoveProductFromCart, handleUpdateCart, handleUpdateProductQuantity } from "../../controllers/carts.controller.js"

class CartsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.read("/:cid", ["USER", "ADMIN"], handleGetCartById);
        this.create("/", ["USER"], handleCreateCart);
        this.create("/:cid/products/:pid", ["USER"], handleAddProductToCart);
        this.destroy("/:cid", ["USER"], handleClearCart);
        this.destroy("/:cid/products/:pid", ["USER"], handleRemoveProductFromCart);
        this.update("/:cid", ["USER", "ADMIN"], handleUpdateCart);
        this.update("/:cid/products/:pid", ["USER", "ADMIN"], handleUpdateProductQuantity);
    }
    
}

const cartsApiRouter = new CartsApiRouter();
export default cartsApiRouter.getRouter();
