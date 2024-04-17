import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { uploader } from "./multer.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 8080
//Configuracion Socket.io
const httpServer = app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("escuchando al puerto 8080");
});

const io = new Server(httpServer);

//Manejo de Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpeta public estatica
app.use(express.static(__dirname + "/public"));

//Motor de plantilla
app.engine("handlebars", handlebars.engine());

//Seteo de la direccion de las plantillas
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Endpoint para morstrar la pagina
app.use("/", viewsRouter);

//Enpoint para subir archivos con Multer
app.use("/subir-archivo", uploader.single("MyFile"), (req, res) => {
  if (!req.file) {
    return res.send("No se puede subir el archivo");
  }
  res.send("archivo subido");
});

//Otros endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
  // console.log("Nuevo cliente conectado");

  // socket.on('message', data => console.log(data))

  // socket.emit('socket_individual', 'este mensaje solo deben recibir los sockets')

  // socket.broadcast.emit('para_todos_menos_el_actual', 'Este mensaje es para todos menos el cliente actual')

  // socketServer.emit('socket_para_todos', 'es mensaje es para todos los sockets incluido el actual')

  const messages = [];

  // socket.on("mensaje_cliente", (data) => {
  //   messages.push({ id: socket.id, message: data });
    

  //   socket.emit("message-server", messages);
  // });
});

const messages = []
io.on('connection', socket => {
  console.log('cliente conectado al chat')

  socket.on('message', data => {console.log('message data' , data)

  messages.push(data)

  io.emit('messageLog', messages)
}
)})
