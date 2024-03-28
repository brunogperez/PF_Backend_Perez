import { cartsService, productsService, usersService } from '../services/index.js'
import { logger } from './logger.js'

export const existEmail = async (email) => {
  const existingEmail = await usersService.getUserByEmail(email)
  if (existingEmail)
    throw new Error(`El email ${email} ya esta registrado`)
}

export const existCode = async (code) => {

  const existingCode = await productsService.getProductByCode(code)
  if (existingCode)
    throw new Error(`El code ${code} ya esta registrado en otro producto`)
}

export const existProduct = async (idProduct) => {
  const existingProduct = await productsService.getProductById(idProduct)
  if (!existingProduct)
    throw new Error(`El id ${idProduct} del producto no existe`)
}

export const existCart = async (cartID) => {
  const existingCart = await cartsService.getCartById(cartID)
  if (!existingCart)
    throw new Error(`El id ${cartID} del carrito no existe`)
}

export const validateStock = async () => {
  try {


    return newProducts
  } catch (error) {
    logger.error(error)

  }
}