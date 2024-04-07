import productModel from './models/products.model.js'

export default class Products {
  constructor() { }

  getProducts = async ({ limit = 10, page = 1, sort, query }) => {
    page = page == 0 ? 1 : page;
    page = Number(page);
    limit = Number(limit)
    const skip = (page - 1) * limit;
    const sortOrderOptions = { 'asc': -1, 'desc': 1 };
    sort = sortOrderOptions[sort] || null;

    try {
      if (query)
        query = JSON.parse(decodeURIComponent(query))
    } catch (error) {
      req.logger.error('Error al parsear', error)
      query = {}
    }

    query = { ...query, status: true };

    const queryProducts = productModel.find(query).limit(limit).skip(skip);

    if (sort !== null)
      queryProducts.sort({ price: sort });

    const [productos, totalDocs] = await Promise.all([queryProducts, productModel.countDocuments(query)]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;


    return {
      totalDocs,
      totalPages,
      limit,
      query: JSON.stringify(query),
      page,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      payload: productos,
    }
  }

  getProductById = async (pid) => await productModel.findById(pid).lean().exec()

  getProductByFilter = async (filter) => await productModel.findOne(filter).lean().exec()

  getProductByCode = async (code) => await productModel.findOne({ code }).lean().exec()

  addProduct = async (product) => await productModel.create(product)

  updateProduct = async (pid, data) => await productModel.updateOne({ _id: pid }, { $set: { ...data } })

  deleteProduct = async (pid) => await productModel.deleteOne({ _id: pid })

}