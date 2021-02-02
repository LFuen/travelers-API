const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersArray = () => {
    return [
        {
            id: 1,
            username: 'First Username',
            name: 'First User',
            password: 'First User Password'
        },

        {
            id: 2,
            username: 'Second Username',
            name: 'Second User',
            password: 'Second User Password'
        }
    ]
}

const authHeader = (user, secret = process.env.JWT_SECRET) => {
    const token = jwt.sign({user_id: user.id}, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

const truncateTables = (db) => {
    return db.raw(`TRUNCATE "guide", "user" RESTART IDENTITY CASCADE`)
}

const seedUsers = (db, users) => {
    const preppedUsers = users.map(user => ({
        ...user,
        password: crypt.hashSync(user.password, 1)
    }))
    return db.transaction(async trx => {
        await trx.into('user').insert(preppedUsers)

        await trx.raw(
            `SELECT setval('user_id_seq', ?)`,
            [users[users.length - 1].id]
        )
    })
}

module.exports = {
    usersArray,
    authHeader,
    truncateTables,
    seedUsers
}