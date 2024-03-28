import { Router } from 'express'
import { check } from 'express-validator'
import {
  deleteProductFromCart,
  getCartById,
  addProductsInCart,
  updateProductsInCart,
  deleteCartProducts,
  purchaseCart
} from '../controllers/carts.controller.js'
import { validarJWT, validateFields } from '../middlewares/auth.middlewares.js'
import { existCart } from '../utils/dbValidator.js'


const router = Router()

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
  check('cid', 'cartID inválido').isMongoId(),
  check('pid', 'productID inválido').isMongoId(),
  validateFields
], deleteProductFromCart)


router.post('/:cid/purchase',[
  validarJWT,
  check('cid', 'cartID inválido').isMongoId(),
  check('cid').custom(existCart),
  validateFields
], purchaseCart)


export default router