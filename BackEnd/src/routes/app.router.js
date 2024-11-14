import { Router } from "express";
import apiRouter from "./api/app.api.js";
import { showProducts } from "./views/products.view.js";

const appRouter = Router();

// appRouter.use("/", viewsRouter);
appRouter.use("/api", apiRouter);
appRouter.use("/products", showProducts)

export default appRouter