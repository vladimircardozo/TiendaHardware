import { Router } from "express";
import { create } from "../../data/mongo/managers/users.manager.js";
import isVerifyPassword from "../../middlewares/isVerifyPassword.mid.js";
import validateRequiredFields from "../../middlewares/validateRequiredFields.mid.js";
import checkUserExists from "../../middlewares/checkUserExists.mid.js";

const sessionsRouter = Router();

// Ruta para mostrar el formulario de registro
sessionsRouter.get("/register", (req, res) => {
    res.render("sessions/register")
});

sessionsRouter.post("/register",
    validateRequiredFields,
    async(req, res, next) => {
    
    try {
        const data = req.body;
        const response = await create(data);
        const message = "USER REGISTERED"
        return res.status(201).json({ message, response });
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post("/login",
    validateRequiredFields, 
    checkUserExists,
    isVerifyPassword, 
    (req, res, next) => {
    try {
        req.session.online = true;
        req.session.email = req.body.email;
        const message = "USER LOGGED IN";
        return res.status(200).json({ message });
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post("/signout", async(req, res, next) => {
    try {
        const session = req.session;
        req.session.destroy();
        return res.status(200).json({ message: "USER SIGNED OUT", session });
    } catch (error) {
        return next(error);
    }
})

sessionsRouter.post("/online", async(req, res, next) => {
    try {
        const sessions = req.session;
        console.log(sessions);
        if (sessions.online) {
            return res.status(200).json({ message: "USER IS ONLINE", sessions });
        }
        return res.status(400).json({ message: "USER IS NOT ONLINE", sessions })

    } catch (error) {
        return next(error);
    }
})

export default sessionsRouter;