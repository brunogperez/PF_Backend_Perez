import express from 'express'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

//BASE DE DATOS
import { mongoDBConnection } from './database/mongoConfig.js'

//ROUTERS
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import sessionRouter from './routes/session.router.js'
import ticketsRouter from './routes/tickets.router.js'

//UTLIDADES
import __dirname from './utils.js'
import { logger } from './utils/logger.js'
import { ACCESS_TOKEN_MP, PORT, URL_HOME_FRONT } from './config/config.js'
import { requestUrl } from './middlewares/logger.middlewares.js'
import { MercadoPagoConfig, Preference } from 'mercadopago'


const app = express()

app.use(cors())
app.use(requestUrl)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Documentación de la API',
      description: 'Proyecto final Backend Perez Bruno'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const spec = swaggerJsDoc(swaggerOptions)


//ENDPOINTS
app.use('/api/session', sessionRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))


await mongoDBConnection()
app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`))



const client = new MercadoPagoConfig({
  accessToken: ACCESS_TOKEN_MP,
})

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
        success: URL_HOME_FRONT,
        failure: URL_HOME_FRONT,
        pending: URL_HOME_FRONT,
      },
      auto_return: 'approved'
    }

    const preference = new Preference(client)

    const result = await preference.create({body})

    return res.json({id: result.id})

  } catch (error) {
    console.log(error)
    res.status(500).json({ok:false , msg: 'Error del servidor'})
  }
})