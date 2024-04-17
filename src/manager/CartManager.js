import fs from "fs";

export default class CartManager {
  #path;
  #carts;
  constructor() {
    this.#carts = [];
    this.#path = "./Carrito.json";
  }

  readFile = async () => {
    try {
      if (this.#path) {
        const carts = await fs.promises.readFile(`${this.#path}`, "utf-8");
        return JSON.parse(carts);
      }
    } catch (error) {
      throw new Error("No se pudo leer el archivo");
    }
  };

  AddCart = async () => {
    try {
      this.#carts = await this.readFile();

      const newCart = {
        id: this.#getNewId(),
        products: [],
      };

      this.#carts.push(newCart);

      await fs.promises.writeFile(
        `${this.#path}`,
        JSON.stringify(this.#carts, null, "\t"),
        "utf-8"
      );

      console.log("Carrito agegado exitosamente!!");
      return newCart;
    } catch (error) {
      throw new Error("Ha surgido un problema al crear el carrito");
    }
  };

  getCarts = async () => {
    try {
      const carts = await this.readFile();
      return carts;
    } catch (error) {
      throw new Error(
        "Ha surgido un error al recuperar los datos de los carritos"
      );
    }
  };

  getCartById = async (id) => {
    try {
      const carts = await this.readFile();
      const cart = carts.find((c) => c.id === parseInt(id));
      if (!cart) {
        return "El carrito no se encuentra";
      }
      return cart;
    } catch (error) {
      throw new Error("Ha ocurrido un error...");
    }
  };

  #getNewId() {
    if (this.#carts.length === 0) {
      return 1;
    }
    return this.#carts.at(-1).id + 1;
  }
}
