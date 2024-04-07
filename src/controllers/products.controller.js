import { productsService } from '../services/index.js'
import { cloudinary } from '../config/cloudinary.js'
import { validFileExtension } from '../utils/validFileExtension.js'
import { faker } from '@faker-js/faker'
import { logger } from '../utils/logger.js'


export const addProduct = async (req, res) => {
  try {
    const { title, description, price, code, stock, category } = req.body

    if (!title || !description || !price || !code || !stock || !category) return res.status(400).json({ msg: 'Datos incompletos' })

    const { _id } = req

    if (req.file) {

      const isValidExtension = validFileExtension(req.file.originalname)

      if (!isValidExtension)
        return res.status(400).json({ msg: 'La extensión del archivo no es valida, [png -jpg -jpeg]' })

      const { secure_url } = await cloudinary.uploader.upload(req.file.path)

      req.body.thumbnails = secure_url
    }

    req.body.owner = _id
    const producto = await productsService.addProduct({ ...req.body })

    return res.json({ producto })

  } catch (error) {
    logger.error(error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const getProducts = async (req, res) => {
  try {
    const result = await productsService.getProducts({ ...req.query })
    return res.json({ result })
  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params
    const product = await productsService.getProductById(pid)
    if (!product)
      return res.status(404).json({ msg: `El producto con id ${pid} no existe` })
    return res.json({ product })
  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params
    const { _id, ...rest } = req.body

    const product = await productsService.getProductById(pid)

    if (!product)
      return res.status(404).json({ msg: `El producto con Id ${pid} no existe!` })

    if (req.file) {

      const isValidExtension = validFileExtension(req.file.originalname)

      if (!isValidExtension)
        return res.status(400).json({ msg: 'La extensión no es valida' })

      if (product.thumbnails) {
        const url = product.thumbnails.split('/')
        const nombre = url[url.length - 1]
        const [id] = nombre.split('.')
        cloudinary.uploader.destroy(id)
      }

      const { secure_url } = await cloudinary.uploader.upload(req.file.path)
      rest.thumbnails = secure_url
    }

    const producto = await productsService.updateProduct(pid, rest)

    if (producto)
      return res.json({ msg: 'Producto actualizado', producto })
    return res.status(404).json({ msg: `No se pudo actualizar el producto con ${pid}` })
  } catch (error) {
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params
    const { role, _id } = req

    if (role === 'premium') {
      const product = await productsService.getProductById(pid)
      if (!product) return res.status(404).json({ msg: `El producto con Id ${pid} no existe!` })

      if (product.owner.toString() === _id) {
        const product = await productsService.deleteProduct(pid)
        if (product)
          return res.json({ msg: 'Producto Eliminado', product })
        return res.status(404).json({ msg: `No se pudo eliminar el producto con ${pid}` })
      }
    }

    const product = await productsService.deleteProduct(pid)
    //cloudinary.uploader.destroy(pid)

    if (product)
      return res.json({ msg: 'Producto Eliminado', product })
    return res.status(404).json({ msg: `No se pudo eliminar el producto con ${pid}` })
  } catch (error) {
    logger.error('deleteProduct ->', error)
    return res.status(500).json({ msg: 'Contacta al soporte' })
  }
}

export const mockingProducts = async (req, res) => {
  try {
    faker.location = 'es'
    const products = Array.from({ length: 100 }, (_, index) => ({
      _id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      code: (index + 1).toString(),
      price: faker.number.int({ min: 1, max: 100 }),
      status: faker.datatype.boolean(),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      thumbnail: faker.image.url(),
    }))
    return res.json({ products })
  } catch (error) {
    logger.error(error)
  }
}