const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersArray = () => {
    return [
        {
            id: 1,
            username: 'First Username',
            password: 'First User Password'
        },

        {
            id: 2,
            username: 'Second Username',
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

const truncTables = (db) => {
    return db.raw(`TRUNCATE "user", "guide" RESTART IDENTITY CASCADE`)
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

const guidesArray = () => {
    return [
        {
            guide_type: 'Stay',
            city: 'Miami Beach',
            recommendation: 'Marriott Miami Beach',
            comments: 'This place is amazing and the staff is great.'
        
        },

        {
            guide_type: 'Food',
            city: 'Miami',
            recommendation: `Frankie's Pizza`,
            comments: `This is probably THE best pizza place in all of Miami. But only if you're a fan of Italian-style square pizza!`
        }
    ]
}

const guidesArrayId = () => {
    return [
        {
            id: 1,
            guide_type: 'Stay',
            city: 'Miami Beach',
            recommendation: 'Marriott Miami Beach',
            comments: 'This place is amazing and the staff is great.'
        
        },

        {
            id: 2,
            guide_type: 'Food',
            city: 'Miami',
            recommendation: `Frankie's Pizza`,
            comments: `This is probably THE best pizza place in all of Miami. But only if you're a fan of Italian-style square pizza!`
        }
    ]
}


function misGuide() {
    const badGuide = {
      id: 911,
      guide_type: "Food",
      city: "Evil City",
      recommendation: 'Worst recommendation',
      comments: "Rude comments",
    };
  
    const expectedGuide = {
      ...badGuide,
      id: 1,
      guide_type: 'Food',
      city: 'Evil City',
      recommendation: 'Worst recommendation',
      comments: 'Rude comments'
    };
    return {
      badGuide,
      expectedGuide,
    };
  }


module.exports = {
    usersArray,
    guidesArray,
    guidesArrayId,
    authHeader,
    truncTables,
    seedUsers,
    misGuide
}