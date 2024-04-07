import { cartsService, productsService, ticketsService, usersService } from '../services/index.js'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger.js'
import { sendEmailTicket } from '../utils/sendEmail.js'
import { ACCESS_TOKEN_MP, URL_HOME_FRONT } from '../config/config.js'
import { MercadoPagoConfig, Preference } from 'mercadopago'

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

    if (!user) return res.status(400).json({ ok: false, msg: 'Usuario no existe!' })

    if (!(user.cart_id.toString() === cid)) return res.status(400).json({ ok: false, msg: 'Carrito no valido!' })

    const existeProducto = await productsService.getProductById(pid)

    if (!existeProducto) return res.status(400).json({ ok: false, msg: 'El producto no existe!' })

    const cart = await cartsService.addProductsInCart(cid, pid)

    /*  if (!cart) return res.status(404).json({ msg: `El cart con id ${cid} no existe!` })
  */
    return res.json({ msg: 'Carrito actualizado!', cart })

  } catch (error) {

    return res.status(500).json({ msg: 'Hablar con un administrador' })

  }
}

export const updateProductsInCart = async (req, res) => {

  try {

    const { _id } = req
    const { cid, pid } = req.params
    const { quantity } = req.body

    const user = await usersService.getUserById(_id)
    if (!user) return res.status(400).json('user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).json('El producto no existe')

    if (!quantity || !Number.isInteger(quantity))
      return res.status(404).json('La cantidad es obligatoria y debe ser un numero entero')

    const cart = await cartsService.updateProductsInCart(cid, pid, quantity)

    if (!cart)
      return res.status(404).json('No se pudo realizar esa operacion')

    return res.json({ msg: 'Producto actualizado en el cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const deleteProductsInCart = async (req, res) => {

  try {

    const { _id } = req
    const { cid, pid } = req.params

    const user = await usersService.getUserById(_id)
    if (!user) return res.status(400).json('El user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).json('El producto no existe')

    const cart = await cartsService.deleteProductsInCart(cid, pid)

    return res.json({ msg: 'Producto eliminado del cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const deleteCartProducts = async (req, res) => {
  try {

    const { _id } = req
    const { cid, pid } = req.params

    const user = await usersService.getUserById(_id)
    if (!user) return res.status(400).json('El user no existe')

    if (!(user.cart_id.toString() === cid)) return res.status(400).json('cart no valido')

    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).json('El producto no existe')

    const cart = await cartsService.deleteCartProducts(cid)

    return res.json({ msg: 'Productos eliminados del cart', cart })

  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const { _id } = req
    const { cid } = req.params

    const user = await usersService.getUserById(_id)

    if (!(user.cart_id.toString() === cid)) return res.status(400).json({ ok: false, msg: 'Carrito no es valido!' })

    const cart = await cartsService.getCartById(cid)

    if (!(cart.products.length > 0)) return res.status(400).json({ ok: false, msg: 'No se puede finalizar la compra, cart vacio!', cart })

    const productosStockValid = cart.products.filter(p => p.id.stock >= p.quantity)

    const actualizacionesQuantity = productosStockValid.map(p =>
      productsService.updateProduct(p.id._id, { stock: p.id.stock - p.quantity }))
    await Promise.all(actualizacionesQuantity)


    const items = productosStockValid.map(i => ({
      title: i.id.title,
      price: i.id.price,
      quantity: i.quantity,
      total: i.id.price * i.quantity
    }))

    let amount = 0
    items.forEach(element => { amount = amount + element.total })

    const purchase = user.email

    const code = uuidv4()

    const ticketCompra = await ticketsService.createTicket({ items, amount, purchase, code })

    // enviar email del recibo de la compra
    sendEmailTicket(user.email, code, user.first_name, items, amount)

    await cartsService.deleteCartProducts(cid)

    return res.json({ ok: true, msg: 'Compra generada', ticket: { code, cliente: purchase, items, amount } })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}


export const createIdPreference = async (req = request, res = response) => {
  try {
    const { _id } = req;
    const { cid } = req.params

    const client = new MercadoPagoConfig({
      accessToken: ACCESS_TOKEN_MP,
    })

    const cart = await cartsService.getCartById(cid)

    const items = cart.products.map(item => {
      return {
        title: item.id.title,
        unit_price: Number(item.id.price),
        quantity: Number(item.quantity),
        currency_id: 'ARS'
      }
    });

    const back_urls = {
      success: URL_HOME_FRONT,
      failure: URL_HOME_FRONT,
      pending: URL_HOME_FRONT,
    };

    const body = {
      items: items,
      back_urls: back_urls,
      auto_return: 'approved'
    }

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return res.json({ ok: true, idPreference: result.id });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ ok: false, msg: 'Error del servidor' })
  }
};

/* 

app.post('/payment-intent', async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: 'ARS',
        },
      ],
      back_urls: {
    
      },
      auto_return: 'approved'
    }

    const preference = new Preference(client)

    const result = await preference.create({ body })

    return res.json({ id: result.id })

  } catch (error) {
    console.log(error)
    
  }
})
 */