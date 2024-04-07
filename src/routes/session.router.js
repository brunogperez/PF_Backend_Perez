import { Router } from 'express'
import {
  changePassword,
  deleteUser,
  deleteUsers,
  getUsers,
  resetPassword,
  revalidateToken,
  sessionLogin,
  sessionRegister,
  validateTokenPass,
} from '../controllers/session.controller.js'

import { check } from 'express-validator'
import { isAdmin, validarJWT, validateFields } from '../middlewares/auth.middlewares.js'
import { existEmail } from '../utils/dbValidator.js'

const router = Router()

router.get('/users', [
  
  
], getUsers)

router.post('/login', [
  check('email', 'El email es obligatorio').not().isEmpty(),
  check('email', 'El email tiene el formato incorrecto').isEmail(),
  check('password', 'La contraseña es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateFields
], sessionLogin)

router.post('/register', [
  check('first_name', 'El nombre es obligatorio').not().isEmpty(),
  check('last_name', 'El apellido es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').not().isEmpty(),
  check('email', 'El email tiene el formato incorrecto').isEmail(),
  check('email').custom(existEmail),
  check('password', 'La contraseña es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateFields
], sessionRegister)

router.get('/renew', validarJWT, revalidateToken)

router.post('/change-password', [
  check('email', 'El email es obligatorio').not().isEmpty(),
  check('email', 'El email debe ser valido').isEmail(),
  validateFields
], changePassword)

router.get('/reset-password', [
  check('token', 'El token es olbligatorio').not().isEmpty(),
  validateFields
], validateTokenPass)

router.post('/reset-password', [
  check('token', 'El token es olbligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateFields
], resetPassword)

router.post('/delete-user/:id', [], deleteUser)

router.post('/delete-users', [], deleteUsers)



export default router