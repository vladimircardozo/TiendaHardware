import CustomRouter from '../../utils/CustomRouter.util.js';
import { readById } from '../../data/mongo/managers/users.manager.js';
import passportCb from '../../middlewares/passportCb.mid.js';
import { verifyTokenUtil } from '../../utils/token.util.js';

class SessionsApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init() {
    // Rutas para renderizar
    this.read('/register', ['PUBLIC'], (req, res) => {
      res.render('sessions/register');
    });

    this.read('/login', ['PUBLIC'], (req, res) => {
      res.render('sessions/login');
    });

    this.create('/register', ['PUBLIC'], passportCb('register'), register);
    this.create('/login', ['PUBLIC'], passportCb('login'), login);
    this.create('/signout', ['USER', 'ADMIN'], passportCb('signout'), signout);
    this.create(
      '/online',
      ['USER', 'ADMIN'],
      passportCb('online'),
      onlineToken
    );
    this.read(
      '/google',
      ['PUBLIC'],
      passportCb('google', { scope: ['email', 'profile'] })
    );
    this.read('/google/cb', ['PUBLIC'], passportCb('google'), google);
  }
}

const sessionsRouter = new SessionsApiRouter();
export default sessionsRouter.getRouter();

async function register(req, res) {
  const user = req.user;
  return res
    .status(201)
    .json({ message: 'USER REGISTERED', user_id: user._id });
}

async function login(req, res) {
  const { token } = req.user;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  const message = "User logged in!";
  const response = "OK";
  return res.cookie("token", token, opts).json200(response, message);
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