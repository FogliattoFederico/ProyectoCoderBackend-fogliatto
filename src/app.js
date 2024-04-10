import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";
import handlerbars from "express-handlebars";
import { uploader } from "./multer.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/virtual", express.static(__dirname + "/public"));

app.engine("handlerbars", handlerbars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlerbars");

app.use("/subir-archivo", uploader.single("MyFile"), (req, res) => {
  if (!req.file) {
    return res.send("No se puede subir el archivo");
  }
  res.send("archivo subido");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("escuchando al puerto 8080");
});
