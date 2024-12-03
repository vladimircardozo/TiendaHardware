import CustomRouter from '../../utils/CustomRouter.util.js';
import ProductsApiRouter from './products.api.js';
import CartApiRouter from './carts.api.js';
// import CookiesRouter from "./cookies.api.js";
import sessionsRouter from './sessions.api.js';
import usersApiRouter from './users.api.js';

class ApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.use('/users',['USER', 'ADMIN'], usersApiRouter);
    this.use('/products', ["PUBLIC"], ProductsApiRouter);
    this.use('/carts',['USER', 'ADMIN'], CartApiRouter);
    // this.use("/cookies", CookiesRouter);
    this.use('/sessions',["PUBLIC"], sessionsRouter);
  }
}

const apiRouter = new ApiRouter();
export default apiRouter.getRouter();
