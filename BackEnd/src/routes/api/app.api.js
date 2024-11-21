import { Router } from "express";
import ProductsApiRouter from  "./products.api.js";
import CartApiRouter from "./carts.api.js"
// import CookiesRouter from "./cookies.api.js";
import sessionsRouter from "./sessions.api.js";
import usersApiRouter from "./users.api.js";

const apiRouter =  Router();

apiRouter.use("/users", usersApiRouter);
apiRouter.use('/products', ProductsApiRouter);
apiRouter.use("/carts",  CartApiRouter);
// apiRouter.use("/cookies", CookiesRouter);
apiRouter.use("/sessions", sessionsRouter);

export default apiRouter