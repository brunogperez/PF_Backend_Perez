import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

//BASE DE DATOS
import { mongoDBConnection } from "./database/mongoConfig.js";

//ROUTERS
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import chatRouter from "./routes/chat.router.js";

//UTLIDADES
import __dirname from "./utils.js";
import { logger } from "./utils/logger.js";
import { PORT } from "./config/config.js";
import { requestUrl } from "./middlewares/logger.middlewares.js";
import { Server } from "socket.io";
import http from "http";
import { messagesService } from "./services/index.js";

const app = express();

app.use(cors());
app.use(requestUrl);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentación de la API",
      description: "Proyecto final Backend Perez Bruno",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const spec = swaggerJsDoc(swaggerOptions);

//ENDPOINTS
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/chat", chatRouter);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

await mongoDBConnection();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://pf-backend-front-perezbruno.netlify.app/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado", socket.id);

  socket.on("mensaje", async (messageData) => {
    console.log("Mensaje recibido en el backend:", messageData);
    try {
      console.log("Intentando guardar en MongoDB...");
      const savedMessage = await messagesService.createMessage(
        messageData.user,
        messageData.message
      );
      console.log("Mensaje guardado en MongoDB:", savedMessage);
      io.emit("mensaje", savedMessage);
    } catch (error) {
      console.error("Error al guardar el mensaje en MongoDB:", error);
    }
  });
});

//app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`))

server.listen(PORT, () => logger.info(`Listening on port: ${PORT}`));
