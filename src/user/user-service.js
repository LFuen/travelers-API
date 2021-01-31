const crypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
    usernameTaken(db, username) {
        return db('user')
            .where({ username })
            .first()
            .then(user => !!user)
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('user')
            .returning('*')
            .then(([user]) => user)
    },

    validatePass(password) {
        if(password.length < 8) {
            return 'Please create a password longer than 8 characters.'
        }
        if(password.length > 72) {
            return `Whoa, that's a crazy long password! Can you keep it under 72 characters?`
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return `Please create a password that does not begin or end with an empty space.`
        }
        if(REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return `Password must contain an uppercase letter, a lowercase letter, a number, and a special character.`
        }
        return null
    },

    hashPass(password) {
        return crypt.hash(password, 12)
    },

    serializeUser(user) {
        return {
            id: user.id,
            name: user.name,
            username: user.username
        }
    }
}


module.exports = UserService