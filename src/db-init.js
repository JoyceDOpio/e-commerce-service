const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg')
const products = require('./data/products')

const client = new Client()

const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER NOT NULL PRIMARY KEY,
    title varchar(200) NOT NULL,
    price REAL NOT NULL,
    description varchar(1000) NOT NULL,
    category varchar(200) NOT NULL,
    image varchar(200) NOT NULL,
    rate REAL,
    count REAL    
  );
`

const seedProducts = async client => {
  const sql = `
    INSERT INTO products(
      id,
      title,
      price,
      description,
      category,
      image,
      rate,
      count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `
  const mappedProducts = products.map(product => [
    product.id,
    product.title,
    product.price,
    product.description,
    product.category,
    product.image,
    product.rating.rate,
    product.rating.count
  ])

  for (const product of mappedProducts) await client.query(sql, product)
}

client.connect().then(async () => {
  try {
    console.log("Creating database \"products\" table")
    await client.query(createProductsTable)
    
    console.log("Seeding the \"products\" table")
    await seedProducts(client)
  } catch(err) {
    console.log(err.message)
  } finally {
    client.end()
  }
})
