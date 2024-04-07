import { Router } from 'express'
import { check } from 'express-validator'
import { addProduct, deleteProduct, getProductById, getProducts, mockingProducts, updateProduct } from '../controllers/products.controller.js'
import { isAdmin, validarJWT, validateFields } from '../middlewares/auth.middlewares.js'
import { uploader } from '../config/multer.js'
import { existCode, existProduct } from '../utils/dbValidator.js'

const router = Router();

router.get('/', getProducts);

router.get('/:pid', [
  validarJWT,
  check('pid', 'ID inválido').isMongoId(),
  validateFields
], getProductById)

router.get('/mocking/products', [
  validarJWT
], mockingProducts)

router.post('/', [
  validarJWT,
  isAdmin,
/*   check('title', 'El campo es obligatorio').not().isEmpty(),
  check('description', 'El campo es obligatorio').not().isEmpty(),
  check('code').custom(existCode),
  check('price', 'El campo es obligatorio y numerico').not().isEmpty().isNumeric(),
  check('stock', 'El campo es obligatorio y numerico').not().isEmpty(),
  check('category', 'El campo es obligatorio').not().isEmpty(),
  validateFields, */
  uploader.single('file')
], addProduct)

router.put('/:pid', [
  validarJWT,
  check('pid', 'ID inválido').isMongoId(),
  check('pid').custom(existProduct),
  validateFields,
  uploader.single('file')
], updateProduct)

router.delete('/:pid', [
  validarJWT,
  check('pid', 'ID inválido').isMongoId(),
  check('pid').custom(existProduct),
  validateFields], deleteProduct)

export default router
