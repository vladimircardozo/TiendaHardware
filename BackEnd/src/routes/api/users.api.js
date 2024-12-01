import CustomRouter from "../../utils/CustomRouter.util.js";
import { create, read, update, destroy } from "../../data/mongo/managers/users.manager.js";

class UsersApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.create("/", createUser);
        this.read("/", readUser);
        this.update("/:id", updateUser);
        this.destroy("/:id", destroyUser);
    }
};

const userApiRouter = new UsersApiRouter();
export default userApiRouter.getRouter();

async function createUser(req, res, next) {
    const message = "USER CREATE";
    const data = req.body;
    const response = await create(data);
    return res.status(201).json({ response, message });
};

async function readUser(req, res, next) {
        const message = "USERS FOUND";
        const response = await read();
        return res.status(200).json({ response, message });
};

async function updateUser(req, res, next) {
        const { id } = req.params;
        const data = req.body;
        const message = "USER UPDATED";
        const response = await update(id, data);
        return res.status(200).json({ response, message });
};

async function destroyUser(req, res, next) {
        const { id } = req.params;
        const message = "USER DELETED";
        const response = await destroy(id);
        return res.status(200).json({ response, message });
};