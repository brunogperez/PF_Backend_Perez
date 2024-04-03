import jwt from 'jsonwebtoken'
import { cartsService, usersService } from '../services/index.js'
import { generateToken } from '../utils/jsonWebToken.js'
import { createHash, isValidPassword } from '../utils/bcryptPassword.js'

import { logger } from '../utils/logger.js'
import { sendEmail } from '../utils/sendEmail.js'
import { JWT_PRIVATE_KEY, URL_RESET_PASS } from '../config/config.js'


export const sessionLogin = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await usersService.getUserByEmail(email)
    if (!user) return res.status(400).json('El email no existe')

    const validPassword = isValidPassword(password, user.password)
    if (!validPassword) return res.status(400).json('Password incorrecto')

    user.last_login = new Date()
    await user.save()


    const { _id, first_name, last_name, role, last_login } = user
    const token = generateToken({ _id, first_name, last_name, email, role, last_login })


    return res.json({ user, token })

  } catch (e) {
    logger.error('Error: ' + e)
    return res.status(500).json('Server Error')
  }
}

export const sessionRegister = async (req, res) => {
  try {

    req.body.password = createHash(req.body.password)

    const cart = await cartsService.addCart()
    if (!cart) return res.status(500).json({ ok: false, msg: 'No se pudo crear el cart' })

    req.body.cart_id = cart._id

    const user = await usersService.createUser(req.body)

    const { _id, first_name, last_name, email, role } = user

    const token = generateToken({ _id, first_name, last_name, email, role })

    return res.json({ user, token })

  }
  catch (e) {

    logger.error('Error: ' + e)
    return res.status(500).json('Server Error')

  }
}

export const revalidateToken = async (req, res) => {

  const { _id, first_name, last_name, email, role } = req

  const user = await usersService.getUserByEmail(email)

  const token = generateToken({ _id, first_name, last_name, email, role })

  return res.json({ ok: true, user, token })

}

export const changePassword = async (req, res) => {

  const { email } = req.body
  const user = await usersService.getUserByEmail(email)
  if (!user) return res.status(400).json({ ok: false, msg: 'El usuario no existe' })

  const token = generateToken({ email }, '1h')

  const urlReset = `${URL_RESET_PASS}?token=${token}`

  sendEmail(email, urlReset)

  return res.json({ ok: true, msg: 'Email enviado!' })

}

export const validateTokenPass = async (req, res) => {

  try {

    const { token } = req.query
    const { email } = jwt.verify(token, JWT_PRIVATE_KEY)

    return res.json({ ok: true, token, email })

  } catch (error) {

    logger.error(error)
    res.status(401).json({ ok: false, msg: 'token inválido' })

  }
}

export const resetPassword = async (req, res) => {
  try {

    const { token, password } = req.body
    const { email } = jwt.verify(token, JWT_PRIVATE_KEY)

    const user = await usersService.getUserByEmail(email)
    if (!user) return res.status(400).json({ ok: false, msg: 'El email no existe' })

    const validPassword = isValidPassword(password, user.password)
    if (validPassword) return res.status(400).json('La contraseña debe ser diferente')

    user.password = createHash(password)
    user.save()

    res.json({ ok: true, msg: 'Cambio de contraseña exitoso' })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ ok: false, msg: 'Contactar al soporte' })
  }
}

export const getUsers = async (req, res) => {
  try {

    const { token } = req

    const users = await usersService.getUsers()

    return res.json({ ok: true, users, token })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ ok: false, msg: 'Contactar al soporte' })
  }
}

export const deleteUsers = async (req, res) => {
  try {
    const inactive = new Date()
    inactive.setHours(inactive.getHours() - 48)
    const deleteUsers = await usersService.deleteUsers({ last_login: { $lt: inactive } })
/* 
    await getUsers(deleteUsers)
 */
    res.status(200).json({ ok: true, msg: 'Usuarios eliminados correctamente', deleteUsers })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ ok: false, msg: 'Contactar al soporte' })
  }
}
