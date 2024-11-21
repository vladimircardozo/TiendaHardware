import { Router } from "express";
import { create, read, update, destroy } from "../../data/mongo/managers/users.manager.js";

const userApiRouter = Router();

userApiRouter.post("/", createUser);
userApiRouter.get("/", readUser);
userApiRouter.put("/:id", updateUser);
userApiRouter.delete("/:id", destroyUser);

export default userApiRouter;

async function createUser(req, res, next) {
    try {
    const message = "USER CREATE";
    const data = req.body;
    const response = await create(data);
    return res.status(201).json({ response, message });

    } catch (error) {
        return next(error);
    }
};

async function readUser(req, res, next) {
    try {
        const message = "USERS FOUND";
        const response = await read();
        return res.status(200).json({ response, message });

    } catch (error) {
        return next(error);
    }
};

async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;
        const message = "USER UPDATED";
        const response = await update(id, data);
        return res.status(200).json({ response, message });

    } catch (error) {
        return next(error);
    }
};

async function destroyUser(req, res, next) {
    try {
        const { id } = req.params;
        const message = "USER DELETED";
        const response = await destroy(id);
        return res.status(200).json({ response, message });

    } catch (error) {
        return next(error);
    }
};