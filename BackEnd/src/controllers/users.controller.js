import { create, read, update, destroy } from "../data/mongo/managers/users.manager.js";

async function createUser(req, res) {
    const message = "USER CREATE";
    const data = req.body;
    const response = await create(data);
    return res.status(201).json({ response, message });
};

async function readUser(req, res) {
        const message = "USERS FOUND";
        const response = await read();
        return res.status(200).json({ response, message });
};

async function updateUser(req, res) {
        const { id } = req.params;
        const data = req.body;
        const message = "USER UPDATED";
        const response = await update(id, data);
        return res.status(200).json({ response, message });
};

async function destroyUser(req, res) {
        const { id } = req.params;
        const message = "USER DELETED";
        const response = await destroy(id);
        return res.status(200).json({ response, message });
};

export { createUser, readUser, updateUser, destroyUser }