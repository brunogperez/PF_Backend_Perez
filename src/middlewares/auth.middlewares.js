import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { JWT_PRIVATE_KEY } from '../config/config.js'
import { logger } from '../utils/logger.js'

export const isAdmin = (req, res, next) => {
  if (!(req.role === 'admin' || req.role === 'premium'))
    return res.status(403).json({ ok: false, msg: 'Permisos insuficientes' })
  next()
}

export const validateFields = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json(error)
  }
  next()
}

export const validarJWT = (req, res, next) => {

  const token = req.header('x-token')

  if (!token)
    return res.status(401).json({ ok: false, msg: 'No hay token en la peticion' })

  try {

    const { _id, first_name, last_name, email, role } = jwt.verify(token, JWT_PRIVATE_KEY)

    req._id = _id
    req.email = email
    req.role = role
    req.first_name = first_name
    req.last_name = last_name

  } catch (error) {
    logger.error(error)
    return res.status(401).json({ ok: false, msg: 'Token no valido' })
  }
  next()
}