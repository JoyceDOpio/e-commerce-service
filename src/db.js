const { Pool } = require("pg")
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");

const pool = new Pool()
const saltRounds = 10;

module.exports = {
    createToken: async (userId, expiryDate) => {
        const sql = "INSERT INTO refresh_tokens (user_id, expiry_date) VALUES ($1, $2)"
        const result = pool.query(sql, [userId, expiryDate])
        return result
    },

    createUser: async (firstName, lastName, email, password) => {
        const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)"
        return await bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
                return pool.query(sql, [firstName, lastName, email, hashedPassword])
            })
            .catch((e) => {
                console.error("Failed to register user", e)
                return null
            })
    },

    deleteRefreshToken: async (token) => {
        const sql = "DELETE FROM refresh_tokens WHERE refresh_token = $1"
        const result = await pool.query(sql, [token])
        return result
    },

    getProductById: async (id) => {
        const sql = "SELECT * FROM products WHERE id = $1"
        const { rows } = await pool.query(sql, [id])
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
        })[0]
    },

    getProducts: async () => {
        const sql = "SELECT * FROM products"
        const { rows } = await pool.query(sql)
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
    },

    getRefreshTokenByUserId: async (userId) => {
        const sql = "SELECT * FROM refresh_tokens WHERE user_id = $1"
        const result = await pool.query(sql, [userId])
        return result
    },

    getRefreshTokenByToken: async (token) => {
        const sql = "SELECT * FROM refresh_tokens WHERE refresh_token = $1"
        const result = await pool.query(sql, [token])
        return result
    },

    getUserByEmail: async (email) => {
        const sql = "SELECT * FROM users WHERE email = $1"
        const result = await pool.query(sql, [email])
        return result
    }
}
