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

//UTLIDADES
import __dirname from './utils.js'
import { logger } from './utils/logger.js'
import { PORT } from './config/config.js'
import { requestUrl } from './middlewares/logger.middlewares.js'


const app = express()

app.use(cors())
app.use(requestUrl)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

const swaggerOptions = {
  definition:{
      openapi:'3.1.0',
      info:{
          title:'Documentación de la API',
          description:'Proyecto final Backend Perez Bruno'
      }
  },
  apis:[`${__dirname}/docs/**/*.yaml`],
};
const spec = swaggerJsDoc(swaggerOptions)


//ENDPOINTS
app.use('/api/session', sessionRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api-docs', swaggerUiExpress.serve,swaggerUiExpress.setup(spec))


await mongoDBConnection()
app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`))