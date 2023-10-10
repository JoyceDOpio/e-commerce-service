const { Pool } = require('pg')
const dotenv = require('dotenv');
dotenv.config();
 
const pool = new Pool()

module.exports = {
    getProducts: async () => {
        const { rows } = await pool.query('SELECT * FROM products')
        return rows.map(row => {
            return {
                id: row.id,
                title: row.title,
                price: row.price,
                description: row.description,
                category: row.category,
                image: row.image,
                rating: {
                    rate: row.rate,
                    count: row.count,
                }
            }
        })
    }
}
