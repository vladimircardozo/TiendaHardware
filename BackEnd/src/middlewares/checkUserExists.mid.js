import { readByEmail } from '../data/mongo/managers/products.manager.js';

async function checkUserExists(req, res, next) {
  const { email } = req.body;

  const user = await readByEmail({ email });
  if (user) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }
  req.user = user;
  return next(); // Continúa si no hay usuario
}

export default checkUserExists;
