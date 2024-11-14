import { Router } from "express";

const CookiesRouter = Router();

CookiesRouter.post("/create", (req, res, next) => {
    try {
        const message = "COOKIE SETEADA";

        return res 
        .status(201)
        .cookie("modo", "oscuro") // Cookie sin expiración
        .cookie("rolDeUsuario", "admin", {maxAge: 2000}) // Cookie con expiración de 20 segundos
        .json({message});
    } catch (error) {
        return next(error);
    }
});

CookiesRouter.get("/read", (req, res, next) => {
    try {
        const cookies = req.cookies
        console.log(cookies);
        console.log(cookies["modo"]);
        console.log(cookies.modo);
        const message = "COOKIE LEIDA";
        return res.status(200).json({ message });
    } catch (error) {
        return next(error);
    }
});

CookiesRouter.delete("/destroy/:cookieAborrar", (req, res, next) => {
    try {
        const { cookieAborrar } = req.params;
        const message = "COOKIE ELIMINADA";
        return res
        .status(200)
        .clearCookie.apply(cookieAborrar)
        .json({ message });
    } catch (error) {
        return next(error);
    }
});

CookiesRouter.post("/signed", (req, res, next) => {
    try {
        const message = "COOKIE FIRMADA CREADA";
        return res.status(201).cookie("nombre","igna",{ signed: true }).json({ message });
    } catch (error) {
        return next(error);
    }
});

CookiesRouter.get("/read-signed", (req, res, next) => {
    try {
        const cookies = req.cookies;
        const signedCookies = req.signedCookies;
        return res.status(200).json({ cookies, signedCookies })
    } catch (error) {
        return next(error);
    }
})

export default CookiesRouter;