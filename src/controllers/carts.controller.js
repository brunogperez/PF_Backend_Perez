import { cartsService, productsService, ticketsService, usersService } from '../services/index.js'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger.js'
/* import { PERSISTENCE } from '../config/config.js'
import Mail from '../modules/mail.module.js'
import moment from 'moment'

const mail = new Mail() */

export const getCartById = async (req, res) => {
  try {
    const { _id } = req
    const { cid } = req.params

    const cart = await cartsService.getCartById(cid)
    const user = await usersService.getUserById(_id)

    if (!user) return res.status(400).json('El user no existe')
    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    res.json({ cart })
  }
  catch (error) {
    req.logger.error('Error: ' + error)
    if (error.name == 'CastError') return res.status(404).send('Not found')
    res.status(500).send('Server error')
  }
}

export const addCart = async (req, res) => {
  try {
    const cart = await cartsService.addCart(req.body)
    res.json({ status: cart ? 'success' : 'error', payload: cart })
  }
  catch (error) {
    req.logger.error('Error: ' + error)
    res.status(500).send('Server error')
  }
}

export const addProductsInCart = async (req, res) => {
  try {
    const { _id } = req
    const { cid, pid } = req.params

    const user = await usersService.getUserById(_id)
    const product = await productsService.getProductById(pid)
    const cart = await cartsService.addProductsInCart(cid, pid)

    if (!user) return res.status(400).json('El user no existe')
    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')
    if (!product) return res.status(400).json('Producto no existe')

    if (!cart) return res.status(404).json(`el cart con id ${cid} no existe`)

    return res.json({ msg: 'cart actualizado', cart })


  } catch (error) {
    return res.status(500).json('Hablar con admin')
  }
}

export const updateProductsInCart = async (req, res) => {

  try {

    const { _id } = req;
    const { cid, pid } = req.params
    const { quantity } = req.body

    const user = await usersService.getUserById(_id);
    if (!user) return res.status(400).json('user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid);
    if (!product) return res.status(400).json('El producto no existe')

    if (!quantity || !Number.isInteger(quantity))
      return res.status(404).json('La cantidad es obligatoria y debe ser un numero entero')

    const cart = await cartsService.updateProductsInCart(cid, pid, quantity)

    if (!cart)
      return res.status(404).json('No se pudo realizar esa operacion')

    return res.json({ msg: 'Producto actualizado en el cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Hablar con admin' })
  }
}

export const deleteProductFromCart = async (req, res) => {

  try {

    const { _id } = req
    const { cid, pid } = req.params

    const user = await usersService.getUserById(_id);
    if (!user) return res.status(400).json('El user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).json('El producto no existe')

    const cart = await cartsService.deleteProductFromCart(cid, pid)

    return res.json({ msg: 'Producto eliminado del cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Hablar con admin' })
  }
}

export const deleteCartProducts = async (req, res) => {
  try {

    const { _id } = req
    const { cid, pid } = req.params

    const user = await usersService.getUserById(_id);
    if (!user) return res.status(400).json('El user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).json('El producto no existe')

    const cart = await cartsService.deleteCartProducts(cid)

    return res.json({ msg: 'Productos eliminados del cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Hablar con admin' })
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const { _id } = req;
    const { cid } = req.params;

    const user = await usersService.getUserById(_id);

    if (!(user.cart_id.toString() === cid)) return res.status(400).json({ ok: false, msg: 'cart no es valido' });

    const cart = await cartsService.getCartById(cid);

    if (!(cart.products.length > 0)) return res.status(400).json({ ok: false, msg: 'No se puede finalizar la compra, cart vacio', cart });

    const productosStockValid = cart.products.filter(p => p.id.stock >= p.quantity)

    const actualizacionesQuantity = productosStockValid.map(p =>
      productsService.updateProduct(p.id._id, { stock: p.id.stock - p.quantity }));
    await Promise.all(actualizacionesQuantity);

    const items = productosStockValid.map(i => ({
      title: i.id.title,
      price: i.id.price,
      quantity: i.quantity,
      total: i.id.price * i.quantity
    }));

    let amount = 0;
    items.forEach(element => { amount += element.total });

    const purchaser = user.email;

    const code = uuidv4();

    //console.log({ items, amount, purchaser, code })

    await ticketsService.createTicket({ items, amount, purchaser, code })

    await cartsService.deleteCartProducts(user.cart_id)

    return res.json({ ok: true, msg: 'Compra generada', ticket: { code, cliente: purchaser, items, amount } });
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: "Hablar con admin" })
  }
}