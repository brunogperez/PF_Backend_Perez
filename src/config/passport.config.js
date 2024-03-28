import passport from 'passport'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import { cartsService, usersService } from '../services/index.js'
import JWT from 'passport-jwt'
import { isValidPassword, createHash, jwtSign, generateToken } from '../utils.js'
import { logger } from '../utils/logger.js'
import { JWT_CLIENT_ID, JWT_CLIENT_SECRET } from './config.js'

const LocalStrategy = local.Strategy
const JWTStrategy = JWT.Strategy

const initializePassport = () => {

  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email, age, role } = req.body
    try {
      const user = await usersService.getUserByEmail(username)
      if (user) {
        req.logger.warning('Warning: User already exists')
        return done(null, false)
      }
      const cart = await cartsService.addCart([])

      const newUser = {
        first_name,
        last_name,
        email,
        age,
        role,
        cart: cart?._id || cart?.id || '',
        password: createHash(password)
      }

      const result = await usersService.createUser(newUser)
      return done(null, result)
    }
    catch (e) {
      return done('Errorr: ' + e)
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {
      const user = await usersService.getUserByEmail(username)

      if (!user) {
        req.logger.warning(`User doesn't exists`)
        return done(null, false)
      }

      if (!isValidPassword(user, password)) {
        req.logger.warning('Incorrect password')
        return done(null, false)
      }

      const token = generateToken(user)
      user.token = token

      return done(null, user)
    }
    catch (e) {
      return done('Error: ' + e)
    }
  }))

  passport.use('github', new GithubStrategy({
    clientID: JWT_CLIENT_ID,
    clientSecret: JWT_CLIENT_SECRET,
    callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await usersService.getUserByEmail(profile._json.email)
      if (!user) {
        logger.warning(`User doesn't exists, pass to register`)

        const cart = await cartsService.addCart([])
        user = await usersService.createUser({
          first_name: profile._json.name,
          last_name: '',
          email: profile._json.email,
          age: null,
          password: '',
          cart: cart?._id || cart?.id || '',
          role: profile._json.email == 'adminCoder@coder.com' ? 'admin' : 'user'
        })
      }
      const token = generateToken(user)
      user.token = token

      return done(null, user)
    }
    catch (e) {
      return done('Error: ' + e)
    }
  }))

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: JWT.ExtractJwt.fromExtractors([req => req?.cookies?.jwtCookie ?? null]),
    secretOrKey: jwtSign
  }, (payload, done) => {
    done(null, payload)
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await usersService.getUserById(id)
    done(null, user)
  })
}

export default initializePassport