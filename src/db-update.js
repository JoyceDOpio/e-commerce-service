const dotenv = require("dotenv")
dotenv.config()
const { Client } = require("pg")

const client = new Client()

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		first_name varchar(200) NOT NULL,
		last_name varchar(200) NOT NULL,
		email varchar(200) NOT NULL UNIQUE,
		password varchar(200) NOT NULL
    );
`

const createUuidExtension = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

const createrefreshTokensTable = `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        refresh_token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		user_id UUID NOT NULL REFERENCES users(id),
		expiry_date DATE NOT NULL
    );
`

client.connect().then(async () => {
    try {
        console.log("Creating \"uuid-ossp\" extension")
        await client.query(createUuidExtension)

        console.log("Creating database \"users\" table")
        await client.query(createUsersTable)

        console.log("Creating database \"refresh_tokens\" table")
        await client.query(createrefreshTokensTable)
    } catch(err) {
        console.error(err.message)
    } finally {
        client.end()
    }
})