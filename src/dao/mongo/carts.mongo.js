import { get } from 'mongoose'
import cartModel from './models/carts.model.js'

export default class Carts {
  constructor() { }

  getCartById = async (cid) => {
    try {
      return await cartModel.findById(cid)
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`)
    }
  }

  addCart = async () => {
    try {
      return await cartModel.create({})
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`)
    }
  }

  addProductsInCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid)
      if (!cart) return null

      const productoInCart = cart.products.find(p => p.id.toString() === pid)
      if (productoInCart) {
        productoInCart.quantity++
      } else {
        cart.products.push({ id: pid, quantity: 1 })
      }

      await cart.save()
      return cart
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`)
    }
  }

  updateProductsInCart = async (cid, pid, quantity) => {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid, 'products.id': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      )
      return cart
    } catch (error) {
      throw new Error(`Error updating cart product: ${error.message}`)
    }
  }


  deleteProductsInCart = async (cid, pid) => {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        cid, 
        { $pull: { 'products': { id: pid } } }, 
        { new: true }
      )
      return cart
    } catch (error) {
      throw new Error(`Error deleting product from cart: ${error.message}`)
    }
  }

  deleteCartProducts = async (cid) => {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        cid, 
        { $set: { 'products': [] } }, 
        { new: true }
      )
      return cart
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`)
    }
  }

}

