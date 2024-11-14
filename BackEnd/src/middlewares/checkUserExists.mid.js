import { readByEmail } from "../data/mongo/managers/products.manager.js";

async function checkUserExists(req, res, next) {
    const { email } = req.body;

    try {
        const user = await readByEmail({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // sea agrega a req para que los siguientes middlewares
        return next();
    } catch (error) {
        return next(error);
    }
}

export default checkUserExists;