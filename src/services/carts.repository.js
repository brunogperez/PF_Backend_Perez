export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCartById = async (cid) => await this.dao.getCartById(cid)

  createEmptyCart = async () => {
    try {
      const newCart = await this.dao.addCart();
      return newCart;
    } catch (error) {
      throw new Error(`Error creating empty cart: ${error.message}`);
    }
  }

  addCart = async () => await this.dao.addCart()

  addProductsInCart = async (cid, pid) => await this.dao.addProductsInCart(cid, pid)

  updateProductsInCart = async (cid, pid, quantity) => await this.dao.updateProductsInCart(cid, pid, quantity)

  deleteCartProducts = async (cid) => await this.dao.deleteCartProducts(cid)

  deleteProductsInCart = async (cid, pid) => await this.dao.deleteProductsInCart(cid, pid)
}

