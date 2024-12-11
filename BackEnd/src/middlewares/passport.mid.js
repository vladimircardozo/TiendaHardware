import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { create, readByEmail, readById, update } from '../data/mongo/managers/users.manager.js';
import { createHashUtil, verifyHashUtil } from '../utils/hash.util.js';
import { createTokenUtil } from '../utils/token.util.js';
import envUtil from '../utils/env.util.js';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = envUtil;

passport.use(
  'register',
  new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
      try {
        if (!email || !password) {
        }
        const one = await readByEmail(email);
        if (one) {
          const error = new Error('User already exists');
          error.statusCode = 400;
          return done(error);
        }
        req.body.password = createHashUtil(password);
        const data = req.body;
        const user = await create(data);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, email, password, done) => {
      try {
        const user = await readByEmail(email);
        console.log('Email recibido:', email);
        console.log('Usuario encontrado:', user);
        if (!user) {
          const error = new Error('INVALID CREDENTIALS');
          error.statusCode = 401;
          return done(error);
        }

        const dbPassword = user.password;
        const verify = verifyHashUtil(password, dbPassword);
        if (!verify) {
          const error = new Error('INVALID CREDENTIALS');
          error.statusCode = 401;
          return done(error);
        }

        // Generar el token JWT
        const token = createTokenUtil({ role: user.role, user_id: user._id });
        req.token = token; // Almacena el token en req.token

        return done(null, user); // Devuelve el usuario para continuar con la respuesta
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  "admin",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (data, done) => {
      try {
        const { user_id, role } = data;
        if (role !== "ADMIN") {
          const info = { message: "NOT AUTHORIZE", statusCode: 403 };
          return done(null, false, info);
        }
        const user = await readById(user_id);
        return done(null, user);
      } catch (error) {}
    }
  )
);

passport.use(
  'online',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await readById(user_id);
        const { isOnline } = user;
        if (!isOnline) {
          const info = { message: 'USER IS NOT OFFLINE', statusCode: 401 };
          return done(null, false, info);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'signout',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const { user_id } = payload;
        await update(user_id, { isOnline: false });
        return done(null, { user_id: null });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: BASE_URL + 'sessions/google/cb',
      scope: ['email', 'profile'],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { id, picture } = profile;
        let user = await readByEmail(id);
        if (!user) {
          user = await create({
            email: id,
            photo: picture,
            password: createHashUtil(id),
          });
        }
        req.token = createTokenUtil({ role: user.role, user_id: user._id });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;