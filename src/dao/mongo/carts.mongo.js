import cartModel from './models/carts.model.js'

export default class Carts {
  constructor() { }

  getCartById = async (cid) => await cartModel.findById(cid).populate('products.id', ['title', 'price', 'stock']);

  addCart = async (products) => await cartModel.create({ products: products || [] })

  addProductsInCart = async (cid, pid) => {

    const cart = await cartModel.findById(cid)

    if (!cart)
      return null

    const productInCart = cart.products.find(p => p.id.toString() === pid)

    if (productInCart)
      productInCart.quantity++
    else
      cart.products.push({ id: pid, quantity: 1 })

    cart.save()

    return cart
  }

  updateProductsInCart = async (cid, pid, quantity) => {
    return await cartModel.findOneAndUpdate(
      { _id: cid, 'products.id': pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    )
  }

  deleteCartProducts = async (cid) => await cartModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true });

  deleteProductFromCart = async (cid, pid) => await cartModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true });

}

