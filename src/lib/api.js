const db = require('../db')

exports.getProducts = async (req, res) => {
    const products = await db.getProducts()
    res.json(products)
}

exports.getProductById = async (req, res) => {
    const product = await db.getProductById(req.params.id)
    res.json(product)
}