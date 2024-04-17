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
});

router.get("/index", (req, res) => {
  res.render("index", {});
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});
export default router;
