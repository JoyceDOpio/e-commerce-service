const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const api = require('./lib/api')

app.use('/api', cors())

app.get('/api/products', api.getProducts)

app.get('/api/products/:id', (req, res) =>  api.getProductById(req, res))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))