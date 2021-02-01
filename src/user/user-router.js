const express = require('express')
const path = require('path')
const UserService = require('./user-service')

const userRouter = express.Router()
const parse = express.json()


userRouter
    .post('/', parse, async (req, res, next) => {
        const {name, username, password} = req.body

        for(const field of ['name', 'username', 'password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in the request body.`
                })

        try {
            const passError = UserService.validatePass(password)

            if(passError)
            return res.status(400).json({error: passError})

            const usernameTaken = UserService.usernameTaken(
                req.app.get('db'),
                username
            )

            if(usernameTaken)
            return res.status(400).json({error: `Sorry, that username has been taken.`})

            const hashed = await UserService.hashPass(password)

            const newUser = {
                username,
                password: hashed,
                name
            }

            const user = await UserService.insertUser(
                req.app.get('db'),
                newUser
            )

            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UserService.serializeUser(user))
        } catch(error) {
            next(error)
        }
    })


module.exports = userRouter