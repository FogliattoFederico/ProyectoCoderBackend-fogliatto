import { Router } from "express";
import CartManager from "../../CartManager.js";
import ProductManager from "../../ProductManager.js";
import fs from "fs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cm = new CartManager();
    const carts = await cm.getCarts();
    res.send({
      status: "success",
      message: "Carritos recuperados exitosamente",
      payload: carts,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: "Error al recuperar los carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cm = new CartManager();

    await cm.readFile();
    const cart = await cm.getCartById(cid);

    res.send({
      status: "success",
      message: "Carrito recuperado exitosamente",
      payload: cart,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: "Error al recuperar el carrito" });
  }
});

router.post("/", async (req, res) => {
  try {
    const cm = new CartManager();
    const newCart = await cm.AddCart();
    res.send({
      status: "success",
      payload: newCart,
      message: "Carrito agregado exitosamente",
    });
  } catch (error) {
    res.send
      .status(500)
      .send({ status: "error", error: "No se pudo crear el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cm = new CartManager();
    const pm = new ProductManager();

    const { cid, pid } = req.params;

    const carts = await cm.readFile();
    const products = await pm.readFile();

    const product = products.find((p) => p.id === parseInt(pid));
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });
    }

    const cartIndex = carts.findIndex((c) => c.id === parseInt(cid));
    if (cartIndex === -1) {
      return res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado" });
    }

    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (p) => p.id === product.id
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ id: product.id, quantity: 1 });
    }

    carts[cartIndex] = cart;

    await fs.promises.writeFile(
      "./Carrito.json",
      JSON.stringify(carts, null, "\t")
    );

    res
      .status(200)
      .send({
        status: "success",
        payload: "Producto agregado exitosamente al carrito",
      });
  } catch (error) {
    res
      .status(500)
      .send({
        status: "error",
        message: "Ocurrio un error al procesar la solicitud",
      });
  }
});

export default router