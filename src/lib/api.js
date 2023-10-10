const db = require('../db')

exports.getProductsApi = async (req, res) => {
    const products = await db.getProducts()
    res.json(products)
}