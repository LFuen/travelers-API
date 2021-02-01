require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./middleware/error-handler')
const userRouter = require('./user/user-router')
const authRouter = require('./auth/auth-router')
const guideRouter = require('./guide/guide-router')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')



const app = express()

app.use(
    morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
        skip: () => NODE_ENV === 'test'
    })
)
app.use(helmet())
app.use(cors({origin: CLIENT_ORIGIN}))

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/guides', guideRouter)


app.get('/', (req, res) => {
    res.send(`How YOU doin'?`)
})

app.use(errorHandler)

module.exports = app