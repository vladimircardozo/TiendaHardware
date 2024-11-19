import { Router } from "express";
// import { create } from "../../data/mongo/managers/users.manager.js";
import isValidUser from "../../middlewares/isValidUser.mid.js";
import validateRequiredFields from "../../middlewares/isValidUser.mid.js";
import checkUserExists from "../../middlewares/checkUserExists.mid.js";
// import createHash from "../../middlewares/createHash.mid.js";
// import verifyHash from "../../middlewares/verifyHash.mid.js";
import passport from "../../middlewares/passport.mid.js";

const sessionsRouter = Router();

// Ruta para mostrar el formulario de registro
sessionsRouter.get("/register", (req, res) => {
    res.render("sessions/register")
});

sessionsRouter.get("/login", (req, res) => {
    res.render("sessions/login")
});

sessionsRouter.get("/signout", (req, res) => {
    res.render("sessions/signout")
});

sessionsRouter.get("/online", (req, res) => {
    res.render("sessions/online")
});

sessionsRouter.post("/register",
    validateRequiredFields,
    checkUserExists,
    // createHash,
    async(req, res, next) => {
        passport.authenticate("register", { session: false }, (err, user, info) => {
            if (err) {
                return res.status(err.statusCode || 500).json({ message: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: "USER REGISTRATION FAILED" });
            }

            req.user = user;
            next();
        })(req, res, next);
    },
    async (req, res, next) => {
    try {
        const user = req.user;
        const message = "USER REGISTERED"
        return res.status(201).json({ message, response, user_id: user._id });
    } catch (error) {
        return next(error);
    }
});

sessionsRouter.post("/login",
    validateRequiredFields, 
    checkUserExists,
    // verifyHash,
    passport.authenticate("login", { session: false }),
    // isValidUser, 
    (req, res, next) => {
    try {
        const user = req.user
        req.session.online = true;
        req.session.email = req.body.email;
        const message = "USER LOGGED IN";
        return res.status(200).json({ message, user_id: user._id });
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
        const {user_id} = req.session;
        console.log(user_id);
        const one = await readById(user_id)
        if (req.session.user_id) {
            return res.status(200).json({ message: "USER IS ONLINE", user_id });
        }
        return res.status(400).json({ message: "USER IS NOT ONLINE", user_id })

    } catch (error) {
        return next(error);
    }
})

export default sessionsRouter;