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
      const user = req.user; // Usuario proporcionado por Passport
      const token = req.token; // Token generado por Passport
  
      if (!user || !token) {
        return res.status(400).json({ message: 'Invalid user or token' });
      }
  
      const opts = { maxAge: 60 * 60 * 24 * 7 * 1000, httpOnly: true }; // maxAge en milisegundos
      res.cookie("token", token, opts); // Configura la cookie con el token
  
      return res.status(200).json({ message: 'User logged in' });
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
  
  async function online(req, res) {
    try {
      const { user_id } = req.session;
      if (!user_id) {
        return res.status(400).json({ message: 'User is not online' });
      }
  
      const one = await readById(user_id);
      if (!one) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const message = `${one.email} is online`;
      return res.status(200).json({ online: true, message });
    } catch (error) {
      console.error("Error en online:", error.message);
      return res.status(500).json({ message: "Internal server error" });
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