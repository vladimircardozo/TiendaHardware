import { Router } from "express";
import apiRouter from "./api/app.api.js";

const appRouter = Router();

// appRouter.use("/", viewsRouter);
appRouter.use("/api", apiRouter);

export default appRouter