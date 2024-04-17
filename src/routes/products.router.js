import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pm = new ProductManager();
    const { limit } = req.query;

    const products = await pm.getProducts();

    if (limit) {
      const productLimit = products.slice(0, parseInt(limit));
      return res.send(productLimit);
    }

    return res.send({ status: "success", payload: products });
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", error: "Error al cargar los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pm = new ProductManager();
    const { pid } = req.params;

    const product = await pm.getProductById(parseInt(pid));

    return res.send(product);
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", error: "Error al mostrar el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = req.body;

    const pm = new ProductManager();

    const newProduct = pm.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status
    );

    res.send({ status: "success", message: "Producto agregado correctamente"});
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", error: "Error al crear el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pm = new ProductManager();

    const { pid } = req.params;
    const productUpdate = req.body;

    const product = await pm.updateProduct(parseInt(pid), productUpdate);
    console.log(product);

    res.send({ status: "success", payload: product });
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", error: "Error al modificar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const pm = new ProductManager();
  const productToDelete = await pm.deleteProduct(parseInt(pid));

  res.send({ status: "success", payload: productToDelete });
});

export default router;
