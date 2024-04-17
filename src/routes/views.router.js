import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pm = new ProductManager();
    const products = await pm.readFile();

    res.render("home", {
      products,
      styles: "home-style.css",
    });
  } catch (error) {
    res.status(404).send(error, "Error", message, "Ocurrio un error");
  }
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
  const { io } = req;

  const messages = [];

  io.on("connection", (socket) => {
    console.log("cliente conectado al chat");

    socket.on("message", (data) => {
      console.log("message data", data);

      messages.push(data);

      io.emit("messageLog", messages);
    });
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {});
  const {io} = req

  const pm = new ProductManager()
  try {
    const products = await pm.readFile()
    io.on('connection', socket =>{
      console.log('conectando a la base de datos de productos')

      socket.emit('listProducts', products)
    })
  } catch (error) {
    console.log(error)
  }

});
router.post('/realtimeproducts', async (req,res) => {
  res.render('realtimeproducts', {})
  const {io} = req
  try {
      io.on('connection', socket => {
        console.log('escuchando...')
        socket.on('newProduct', data =>
        console.log(data))
      })
    } catch (error) {
      console.log(error)
    }

  })

export default router;
