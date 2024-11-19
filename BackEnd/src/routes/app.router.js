import { Router } from "express";
import apiRouter from "./api/app.api.js";
import { showProducts } from "./views/products.view.js";
import { showRealTimeProducts } from "./views/realTimeProducts.view.js";
import { productDetail } from "./views/productDetail.view.js";

const appRouter = Router();

// API routes
appRouter.use("/api", apiRouter);

// Vistas
appRouter.get("/products", showProducts);
appRouter.get("/realtimeproducts", showRealTimeProducts);
appRouter.get("/productsdetail", productDetail);

export default appRouter