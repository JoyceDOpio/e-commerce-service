const db = require("./db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")
dotenv.config()

const secret = process.env.ACCESS_TOKEN_SECRET
const accessTokenExpTime = process.env.ACCESS_TOKEN_EXPIRY_TIME
const refreshTokenExpTime = process.env.REFRESH_TOKEN_EXPIRY_TIME

const generateJWT = (userId) => {
    const payload = {
        userId: userId 
    }

    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: accessTokenExpTime
        }
    )
}

module.exports = {
    getProductById: async (req, res) => {
        try {
            const product = await db.getProductById(req.params.id)
            res.json(product)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    },

    getProducts: async (req, res) => {
        try {
            const products = await db.getProducts()
            res.json(products)
        } catch (error) {
            console.error(error)
            res.sendStatus(500) 
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body
        const user = await db.getUserByEmail(email, password)
        const passwordsMatch = await bcrypt.compare(password, user.rows[0].password)

        if (passwordsMatch) {
            const userId = user.rows[0].id
            const accessToken = generateJWT(userId)
            const millisec = new Date().getTime() + parseInt(refreshTokenExpTime)
            const expiryDate = new Date(millisec)
            const createdToken = await db.createToken(userId, expiryDate)

            if (createdToken.rowCount === 1) {
                const refreshToken = await db.getRefreshTokenByUserId(userId)
                
                if (refreshToken.rowCount === 1) {
                    const email = user.rows[0].email
                    const firstName = user.rows[0].first_name
                    const lastName = user.rows[0].last_name
                    
                    res.cookie(
                        "access_token",
                        accessToken,
                        {
                            httpOnly: true,
                        }
                    ).cookie(
                        "refresh_token",
                        refreshToken.rows[0].refresh_token,
                        {
                            httpOnly: true,
                        }
                    ).status(200)
                    .send({
                        userId: userId,
                        email: email,
                        firstName: firstName,
                        lastName: lastName
                    })
                    return
                }
                res.sendStatus(500)
                return
            }
        }
        res.sendStatus(401)
    },

    logoutUser: async (req, res) => {
        const token = req.cookies.refresh_token
        
        try {
            const deletedToken = await db.deleteRefreshToken(token)
            
            if (deletedToken.rowCount === 1) {
                res.clearCookie("access_token")
                res.clearCookie("refresh_token")
                res.sendStatus(200)
                return
            }
            res.sendStatus(500)
        } catch (error) {
            res.sendStatus(500)
        }
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body

        if (refreshToken) {
            try {
                const dbRefreshToken = await db.getRefreshTokenByToken(refreshToken)

                if (dbRefreshToken.rowCount === 1) {
                    const token = dbRefreshToken.rows[0].token
                    const expiryDate = dbRefreshToken.rows[0].expiry_date
                    const tokenExpired = expiryDate.getTime() < Date.now()

                    if (!tokenExpired) {
                        const userId = await dbRefreshToken.rows[0].user_id
                        const newAccessToken = generateJWT(userId)
    
                        res.cookie(
                            "access_token",
                            newAccessToken,
                            {
                                httpOnly: true,
                            }
                        ).cookie(
                            "refresh_token",
                            refreshToken,
                            {
                                httpOnly: true,
                            }
                        ).sendStatus(200)
                        return
                    }

                    try {
                        await db.deleteRefreshToken(token)
                    } catch (error) {
                        throw error
                    }
                }
            } catch (error) {
                console.error(error)
                res.sendStatus(500)
            }
        }
        res.sendStatus(401)
    },

    registerUser: async (req, res) => {
        const { firstName, lastName, email, password } = req.body

        if (firstName && lastName && email && password) {
            try {
                const registered = await db.createUser(firstName, lastName, email, password)

                if (registered.rowCount === 1) {
                    res.sendStatus(201)
                    return
                }
            } catch (error) {
                console.error(error)
                res.sendStatus(500)
            }
        } 
        res.sendStatus(401)
    }
}

