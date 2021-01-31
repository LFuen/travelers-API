const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const parse = express.json()

console.log(requireAuth)

authRouter
    .route('/token')
    .post(parse, async (req, res, next) => {
        const {username, password} = req.body
        const loginUser = {username, password}

        for(const [key, value] of Object.entries(loginUser))
            if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in the request body.`
            })

        try {
            const dbUser = await AuthService.getUserWithUsername(
                req.app.get('db'),
                loginUser.username
            )

            if(!dbUser) 
                return res.status(400).json({
                    error: 'Incorrect username or password.',
                })

            const compare = await AuthService.comparePass(
                loginUser.password,
                dbUser.password
            )

            if(!compare)
                return res.status(400).json({
                    error: 'Incorrect username or password.'
                })

            const sub = dbUser.username
            const payload = {
                user_id: dbUser.id,
                name: dbUser.name
            }
            res.send({
                authToken: AuthService.createJwt(sub, payload)
            })
        } catch(error) {
            next(error)
        }
    })

    .put(requireAuth, (req, res) => {
        const sub = req.user.username
        const payload = {
            user_id: req.user.id,
            name: req.user.name
        }
        res.send({
            authToken: AuthService.createJwt(sub, payload)
        })
    })

module.exports = authRouter