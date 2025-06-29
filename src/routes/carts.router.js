import { Router } from 'express'
import { check } from 'express-validator'
import {
  createEmptyCart,
  associateCartWithUser,
  getCartById,
  addProductsInCart,
  updateProductsInCart,
  deleteCartProducts,
  purchaseCart,
  deleteProductsInCart,
  createIdPreference
} from '../controllers/carts.controller.js'
import { validarJWT, validateFields, isAdmin } from '../middlewares/auth.middlewares.js'
import { existCart } from '../utils/dbValidator.js'


const router = Router()

// Create empty cart
router.post('/', [
  validarJWT
], createEmptyCart)

// Associate cart with user
router.put('/user/:userId/cart', [
  validarJWT,
  check('userId', 'Invalid user ID').isMongoId(),
  check('cartId', 'Cart ID is required').notEmpty(),
  validateFields
], associateCartWithUser)

router.get('/:cid', [
  validarJWT,
  check('cid', 'cartID inválido').isMongoId(),
  validateFields
], getCartById)


router.post('/:cid/product/:pid', [
  validarJWT,
  check('cid', 'cartID inválido').isMongoId(),
  check('pid', 'productID inválido').isMongoId(),
  validateFields
], addProductsInCart)

router.put('/:cid/product/:pid', [
  validarJWT,
  check('cid', 'cartID inválido').isMongoId(),
  check('pid', 'productID inválido').isMongoId(),
  validateFields
], updateProductsInCart)

router.delete('/:cid', validarJWT, deleteCartProducts)

router.delete('/:cid/product/:pid', [
  validarJWT,
  check('cid', 'No es valido el ID del carrito').isMongoId(),
  check('pid', 'No es valido el ID del producto').isMongoId(),
  validateFields,
], deleteProductsInCart);


router.post('/:cid/purchase',[
  validarJWT,
  check('cid', 'cartID inválido').isMongoId(),
  check('cid').custom(existCart),
  validateFields
], purchaseCart)


router.post('/create-preference/:cid',[
  validarJWT,
  check('cid', 'No es valido el ID del carrito').isMongoId(),
  check('cid').custom(existCart),
  validateFields,
], createIdPreference)



export default router