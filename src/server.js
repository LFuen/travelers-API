
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;
const knex = require('knex')
const app = require('./app')
const config = require('./config')

const db = knex({
    client: "pg",
    connection: config.DATABASE_URL,
  });
  
  app.set("db", db);

app.listen(config.PORT, () => {
    console.log(`Server listening at http://localhost:${config.PORT}`)
})



