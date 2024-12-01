import CustomRouter from '../../utils/CustomRouter.util.js';
import { readById } from '../../data/mongo/managers/users.manager.js';
import passport from '../../middlewares/passport.mid.js';
import { verifyTokenUtil } from '../../utils/token.util.js';

class SessionsApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init() {
    // Rutas para renderizar
    this.read('/register', (req, res) => {
      res.render('sessions/register');
    });

    this.read('/login', (req, res) => {
      res.render('sessions/login');
    });

    this.create(
      '/register',
      passport.authenticate('register', { session: false }),
      register
    );
    this.create(
      '/login',
      passport.authenticate('login', { session: false }),
      login
    );
    this.create('/signaut', signout);
    this.create('/online', onlineToken);
    // /api/sessions/google va a llamar a la pantalla de consentimiento y se encarga de autenticar en google
    this.read(
      '/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    // /api/sessions/google/cb va a llamar efectivamente a la estrategia encargada de register/login con google
    this.read(
      '/google/cb',
      passport.authenticate('google', { session: false }),
      google
    );
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
    return res
      .status(200)
      .json({ message: 'USER LOGGED IN', token: req.token });
}

async function signout(req, res) {
    req.session.destroy();
    return res.status(200).json({ message: 'USER SIGNED OUT' });
}

async function online(req, res) {
    const { user_id } = req.session;
    const user = await readById(user_id);
    if (req.session.user_id) {
      return res
        .status(200)
        .json({ message: user.email.toUpperCase() + 'IS ONLINE', online: true });
    } else {
      return res
        .status(400)
        .json({ message: 'USER IS NOT ONLINE', online: false });
    }
}

function google(req, res) {
  return res.redirect('/products'); // Cambia '/dashboard' por la ruta deseada
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