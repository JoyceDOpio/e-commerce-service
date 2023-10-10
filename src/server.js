const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const cors = require('cors')
const api = require('./lib/api')

app.use('/api', cors())

app.get('/api/products', api.getProductsApi)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))