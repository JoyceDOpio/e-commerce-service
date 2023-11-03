const db = require("../db")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

const secret = process.env.ACCESS_TOKEN_SECRET

module.exports = {
    checkEmailDuplicate: async (req, res, next) => {
        const { email } = req.body

        if (email) {
            try {
                const user = await db.getUserByEmail(email)
                if (user.rowCount === 0) {
                    next()
                    return
                }
            } catch (error) {
                console.error(error)
                res.sendStatus(500)
            }
        }
        res.sendStatus(400)
    },

    checkIfUserExists: async (req, res, next) => {
        const { email, password } = req.body
        
        if (email && password) {
            try {
                const user = await db.getUserByEmail(email)
                if (user.rowCount === 1) {
                    res.locals.userId = user.rows[0].id
                    next()
                    return
                }
            } catch (error) {
                console.error(error)
                res.sendStatus(500)
            }
        }
        res.sendStatus(401)
    },

    checkIfUserLogged: async (req, res, next) => {
        const userId = res.locals.userId
        res.locals.userId = null

        try {
            const refreshToken = await db.getRefreshTokenByUserId(userId)
            
            if (refreshToken.rowCount === 0) {
                next()
                return
            }
            if (refreshToken.rowCount === 1) {
                const token = refreshToken.rows[0]
                
                if (token.expiry_date.getTime() < Date.now()) {
                    const deleted = await db.deleteRefreshToken(token.refresh_token)
                    if (deleted.rowCount === 1) {
                        next()
                        return
                    } else {
                        throw new Error(`Deleted possibly more than 1 refresh token for user (userID: ${userId})`)
                    }
                }
                res.sendStatus(400)
            } else {
                throw new Error(`Found more than 1 refresh token assigned to the user (userID: ${userId})`)
            }
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },

    verifyToken: (req, res, next) => {
        const token = req.cookies.access_token

        if (token) {
            jwt.verify(
                token,
                secret,
                function(err, decoded) {
                    if (err) {
                        res.sendStatus(401)
                    }
    
                    if (decoded) {
                        next()
                        return
                    }
                }
            )
        } else {
            res.sendStatus(401)
        }
    }
}