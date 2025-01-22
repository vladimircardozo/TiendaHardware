import { verifyTokenUtil } from '../utils/token.util.js';
import { readById } from '../data/mongo/managers/users.manager.js';

async function register(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'User registration failed' });
    }

    return res
      .status(201)
      .json({ message: 'USER REGISTERED', user_id: user._id });
  } catch (error) {
    console.error('Error en register:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const user = req.user;
    const token = req.token;

    if (!user || !token) {
      return res.status(400).json({ message: 'Invalid user or token' });
    }

    const opts = { maxAge: 60 * 60 * 24 * 7 * 1000, httpOnly: true };
    res.cookie('token', token, opts);

    return res.status(200).json({ message: 'User logged in' });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

async function signout(req, res) {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'User signed out!' });
  } catch (error) {
    console.error('Error en signout:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

async function online(req, res) {
  try {
    const { user_id } = req.session;

    if (!user_id) {
      return res.status(400).json({ message: 'User is not online' });
    }

    const user = await readById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = `${user.email} is online`;
    return res.status(200).json({ online: true, message });
  } catch (error) {
    console.error('Error en online:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

function google(req, res) {
  try {
    return res.redirect('/products');
  } catch (error) {
    console.error('Error en google:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

async function onlineToken(req, res) {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const data = verifyTokenUtil(token);

    if (!data || !data.user_id) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const user = await readById(data.user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found', online: false });
    }

    return res.status(200).json({
      message: `${user.email.toUpperCase()} IS ONLINE`,
      online: true,
    });
  } catch (error) {
    console.error('Error en onlineToken:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}

export { register, login, signout, online, google, onlineToken };
