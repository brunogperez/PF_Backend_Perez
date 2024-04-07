export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao
  }

  getProducts = async (query) => await this.dao.getProducts(query)

  getProductById = async (pid) => await this.dao.getProductById(pid)

  getProductByCode = async (code) => await this.dao.getProductByCode(code)

  getProductByFilter = async (filter) => await this.dao.getProductByFilter(filter)

  addProduct = async (product) => await this.dao.addProduct(product)

  updateProduct = async (pid, fields) => await this.dao.updateProduct(pid, fields)

  deleteProduct = async (pid) => await this.dao.deleteProduct(pid)

}
