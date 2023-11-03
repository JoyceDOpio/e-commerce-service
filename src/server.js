const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const cors = require("cors")
const api = require("./api")
const auth = require("./middleware/auth")
const cookieParser = require("cookie-parser")

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true
}
app.use(cors(corsOptions))

app.use(cookieParser());
app.use(express.json())

app.use("/api/auth/login", auth.checkIfUserExists, auth.checkIfUserLogged)
app.use("/api/auth/logout", auth.verifyToken)
app.use("/api/auth/register", auth.checkEmailDuplicate)

app.get("/api/products", api.getProducts)
app.get("/api/products/:id", (req, res) => api.getProductById(req, res))

app.post("/api/auth/login", (req, res) => api.loginUser(req, res))
app.post("/api/auth/logout", (req, res) => api.logoutUser(req, res))
app.post("/api/auth/refreshtoken", (req, res) => api.refreshToken(req, res))
app.post("/api/auth/register", (req, res) => api.registerUser(req, res))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))