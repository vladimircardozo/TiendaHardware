import { verifyTokenUtil } from '../utils/token.util.js';
import { readById } from '../data/mongo/managers/users.manager.js';

async function register(req, res) {
    const user = req.user;
    return res
      .status(201)
      .json({ message: 'USER REGISTERED', user_id: user._id });
  }
  
  async function login(req, res) {
    try {
        const { token } = req.user;
        const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
        res.cookie("token", token, opts);
        return res.json200("success", "user logged in");
    } catch (error) {
        console.error("Error en login:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
  
  async function signout(req, res) {
    const message = "User signed out!";
    const response = "OK";
    return res.clearCookie("token").json200(response, message);
  }
  
  async function online(req, res, next) {
    const { user_id } = req.session;
    const one = await readById(user_id);
    if (req.session.user_id) {
      const message = one.email + " is online";
      const response = true;
      return res.json200(response, message);
    } else {
      const message = "User is not online";
      return res.json400(message);
    }
  }
  function google(req, res) {
    return res.redirect('/products');
  }
  
  async function onlineToken(req, res) {
    const { token } = req.headers;
    const data = verifyTokenUtil(token);
    const user = await readById(data.user_id);
    if (user) {
      return res
        .status(200)
        .json({ message: user.email.toUpperCase() + 'IS ONLINE', online: true });
    } else {
      return res
        .status(400)
        .json({ message: 'USER IS NOT ONLINE', online: false });
    }
  }

  export { register, login, signout, online, google, onlineToken }