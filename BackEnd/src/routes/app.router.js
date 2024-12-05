import CustomRouter from "../utils/CustomRouter.util.js";
import apiRouter from "./api/app.api.js";
import { showProducts } from "./views/products.view.js";
import { showRealTimeProducts } from "./views/realTimeProducts.view.js";
import { showProductDetail } from "./views/productDetail.view.js";
import { showCartDetail } from "./views/cartDetail.view.js";

class AppRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init() {
        // API routes
this.use("/api", ["PUBLIC"], apiRouter);

// Vistas
this.read("/products",['PUBLIC'], showProducts);
this.read("/realtimeproducts",['ADMIN'], showRealTimeProducts);
this.read("/product/:id",['PUBLIC'], showProductDetail);
this.read("/carts/:cartId",['USER', 'ADMIN'], showCartDetail)
    }
}

let appRouter = new AppRouter();
appRouter = appRouter.getRouter();
export default appRouter;