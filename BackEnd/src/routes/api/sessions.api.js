import { Router } from "express";
import { readById } from "../../data/mongo/managers/users.manager";
import passport from "../../middlewares/passport.mid.js";

const sessionsRouter = Router();

sessionsRouter.post("/register", passport.authenticate("register", {session: false} ), register);
sessionsRouter.post("/login", passport.authenticate("login", {session: false}), login);
sessionsRouter.post("/signaut", signout);
sessionsRouter.post("/online", /*falta token */);
// /api/sessions/google va a llamar a la pantalla de consentimiento y se encarga de autenticar en google
sessionsRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// /api/sessions/google/cb va a llamar efectivamente a la estrategia encargada de register/login con google
sessionsRouter.get("/google/cb", passport.authenticate("google", { session: false }), google);

export default sessionsRouter; 

async function register(req, res, next) {
    try {
        const user = req.user;
        return res.status(201).json({ message: "USER REGISTERED", user_id: user._id });
    } catch (error) {
        next(error);
    }
};

async function login(req, res, next) {
    try {
        return res.status(200).json({ message: "USER LOGGED IN", user_id: req.user._id /*falta token */});
    } catch (error) {
        next(error);
    }
};

async function signout(req, res, next) {
    try {
        req.session.destroy();
        return res.status(200).json({ message: "USER SIGNED OUT" });
    } catch (error) {
        next(error);
    }
}

async function online(req, res, next) {
    try {
        const { user_id } = req.session;
        const user = await readById(user_id);
        if (req.session.user_id) {
            return res.status(200).json({ message: one.email.toUpperCase() + "IS ONLINE", online: true })
        } else {
            return res.status(400).json({ message: "USER IS NOT ONLINE", online: false })
        }
    } catch (error) {
        next(error);
    }
};

function google(req, res, next) {
    try {
        return res.status(200).json({ message: "USER LOGGED IN", /*falta token */ });

    } catch (error) {
        next(error);
    }
}

/*falta token */