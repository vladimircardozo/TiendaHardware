import CustomRouter from "../../utils/CustomRouter.util.js";
import { createUser, readUser, updateUser, destroyUser } from "../../controllers/users.controller.js"

class UsersApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.create("/", ["ADMIN"], createUser);
        this.read("/", ["ADMIN"], readUser);
        this.update("/:id", ["USER", "ADMIN"], updateUser);
        this.destroy("/:id", ["USER", "ADMIN"], destroyUser);
    }
};

const userApiRouter = new UsersApiRouter();
export default userApiRouter.getRouter();