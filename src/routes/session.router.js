import { Router } from 'express';
import { check } from 'express-validator';
import {
  changePassword,
  deleteUser,
  deleteInactiveUsers,
  getUserById,
  switchUserRole,
  getUsers,
  resetPassword,
  revalidateToken,
  sessionLogin,
  sessionRegister,
  validateTokenPass,
  loginValidations,
  registerValidations,
  resetPasswordValidations
} from '../controllers/session.controller.js';

import { isAdmin, validarJWT } from '../middlewares/auth.middlewares.js';
import { validateFields } from '../controllers/session.controller.js';

const router = Router();

// Rutas públicas
router.post('/login', [
  ...loginValidations,
  validateFields
], sessionLogin);

router.post('/register', [
  ...registerValidations,
  validateFields
], sessionRegister);

// Ruta para renovar token
router.get('/renew', validarJWT, revalidateToken);

// Rutas para restablecer contraseña
router.post('/forgot-password', [
  check('email', 'El email es obligatorio').isEmail(),
  validateFields
], changePassword);

router.get('/validate-token', [
  check('token', 'El token es obligatorio').not().isEmpty(),
  validateFields
], validateTokenPass);

router.post('/reset-password', [
  ...resetPasswordValidations,
  validateFields
], resetPassword);

// Rutas protegidas para administradores
router.get('/users', [
  validarJWT,
  isAdmin
], getUsers);

router.delete('/user/:id', [
  validarJWT,
  isAdmin,
  check('id', 'No es un ID válido').isMongoId(),
  validateFields
], deleteUser);

router.delete('/inactive-users', [
  validarJWT,
  isAdmin
], deleteInactiveUsers);

// Obtener un usuario por ID
router.get('/user/:id', [
  validarJWT,
  isAdmin,
  check('id', 'No es un ID válido').isMongoId(),
  validateFields
], getUserById);

// Ruta para cambiar el rol de un usuario
router.put('/switchRole/:id', [
  validarJWT,
  isAdmin,
  check('role', 'El rol es obligatorio').not().isEmpty(),
  check('role', 'Rol no válido').isIn(['user', 'premium', 'admin']),
  validateFields
], switchUserRole);

export default router;