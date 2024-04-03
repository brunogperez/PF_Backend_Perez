import { get } from 'mongoose'
import cartModel from './models/carts.model.js'

export default class Carts {
  constructor() { }

  getCartById = async (cid) => await cartModel.findById(cid).populate('products.id', ['title', 'price', 'stock', 'thumbnail'])

  addCart = async () => await cartModel.create({})

  addProductsInCart = async (cid, pid) => {

    const cart = await cartModel.findById(cid)

    if (!cart)
      return null

    const productoInCart = cart.products.find(p => p.id.toString() === pid)

    if (productoInCart)
      productoInCart.quantity++
    else
      cart.products.push({ id: pid, quantity: 1 })

    await cart.save()

    return this.getCartById(cid)
  }

  updateProductsInCart = async (cid, pid, quantity) => {
    await cartModel.findOneAndUpdate(
      { _id: cid, 'products.id': pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    ).populate('products.id', ['title', 'price', 'stock', 'thumbnail']);
     return this.getCartById(cid) 
  }


  deleteProductsInCart = async (cid, pid) => {
    await cartModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true }).populate('products.id', ['title', 'price', 'stock', 'thumbnail'])
    return this.getCartById(cid)
  }

  deleteCartProducts = async (cid) => await cartModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true })

}

