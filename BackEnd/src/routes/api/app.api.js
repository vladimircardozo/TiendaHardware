import CustomRouter from '../../utils/CustomRouter.util.js';
import ProductsApiRouter from './products.api.js';
import CartApiRouter from './carts.api.js';
// import CookiesRouter from "./cookies.api.js";
import sessionsRouter from './sessions.api.js';
import usersApiRouter from './users.api.js';
import { fork } from "child_process";
// import sum from '../../utils/process.util.js';

class ApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.use('/users',['PUBLIC'], usersApiRouter);
    this.use('/products', ["PUBLIC"], ProductsApiRouter);
    this.use('/carts',['USER', 'ADMIN'], CartApiRouter);
    // this.use("/cookies", CookiesRouter);
    this.use('/sessions',["PUBLIC"], sessionsRouter);
    this.read('/sum', ['PUBLIC'], (req, res) => {
      const child = fork("./src/utils/process.util.js");
      child.send("start");
      child.on("message", (response) => {
        const message = "SUMATORIA OBTENIDA";
        return res.json200({ message, response });
          
      })

    })
  }
}

const apiRouter = new ApiRouter();
export default apiRouter.getRouter();
