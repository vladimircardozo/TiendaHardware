import { readByEmail } from "../data/mongo/managers/products.manager.js";

async function checkUserExists(req, res, next) {
    const { email } = req.body;

    try {
        const user = await readByEmail({ email });

        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        req.user = user;
        return next(); // Continúa si no hay usuario
    } catch (error) {
        return next(error);
    }
}

export default checkUserExists;