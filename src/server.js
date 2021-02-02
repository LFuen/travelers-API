require('dotenv').config()

const app = require('./app')

const config = require('./config')

app.listen(config.PORT, () => {
    console.log(`Server listening at http://localhost:${config.PORT}`)
})