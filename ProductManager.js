import fs from "fs";

export default class ProductManager {
  #products;
  #path;
  constructor() {
    // this.#products = [];
    this.#path = "./Productos.json";
  }

  readFile = async () => {
    try {
      if (this.#path) {
        let products;
        try {
          // Intenta leer el archivo
          products = await fs.promises.readFile(`${this.#path}`, "utf-8");
        } catch (error) {
          // Si ocurre un error al leer el archivo (por ejemplo, no existe), crea un archivo vacío
          if (error.code === 'ENOENT') {
            await fs.promises.writeFile(this.#path, '[]');
            // Lee el archivo recién creado
            products = '[]';
          } else {
            throw error; // Lanza cualquier otro error
          }
        }
        return JSON.parse(products);
      }
    } catch {
      throw new Error("Ha surgido un problema al leer los productos");
    }
  };
  
  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {number} price
   * @param {string} thumbnail
   * @param {string} code
   * @param {string} stock
   * @param {string} category
   * @param {boolean} status
   */
  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status = true
  ) => {
    try {
      const products = await this.readFile();

      const newProduct = {
        id: products.length + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
      };

      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !category ||
        !status
      ) {
        throw new Error("Por favor complete todos los campos");
      }

      const validateProduct = products.find((product) => product.code === code);

      if (validateProduct) {
        throw new Error("El producto ya se encuentra agregado");
      }

      const productsUpdate = [...products, newProduct];

      await fs.promises.writeFile(
        `${this.#path}`,
        JSON.stringify(productsUpdate, null, "\t"),
        "utf-8"
      );
      console.log("Producto agregado exitosamente!!");

    } catch (error) {
      throw new Error(error);
    }
  };

  getProducts = async () => {
    try {
      const products = await this.readFile();
      return products;
    } catch (error) {
      throw new Error("Ha ocurrido un error al recuperar los productos");
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.readFile();
      const product = products.find((product) => product.id === parseInt(id));
      if (!product) {
        return "El producto no se encuentra";
      }
      return product;
    } catch (error) {
      throw new Error("Ha ocurrido un error al obtener el producto");
    }
  };

  updateProduct = async (id, updatedProduct) => {
    try {
      const products = await this.readFile();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error(`El producto con el id ${id} no existe`);
      }

      products[index] = { id: id, ...updatedProduct };
      console.log("Producto modificado exitosamente");

      await fs.promises.writeFile(
        `${this.#path}`,
        JSON.stringify(products, null, "\t"),
        "utf-8"
      );
      return products[index];
    } catch (error) {
      throw new Error(
        "Ha ocurrido un error al querer modificar el producto seleccionado"
      );
    }
  };

  deleteProduct = async (id) => {
    try {
      const products = await this.readFile();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      products.splice(index, 1);
      await fs.promises.writeFile(
        `${this.#path}`,
        JSON.stringify(products, null, "\t"),
        "utf-8"
      );

      console.log("Producto eliminado exitosamente");
      return products[index];
    } catch (error) {
      throw new Error("Ocurrio un error al intentar eliminarl el producto");
    }
  };
}
