const crypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')
const knex = require('knex')

describe(`User Endpoints`, () => {
    let db

    const testUsers = helpers.usersArray()
    const testUser = testUsers[0]

    before(`make knex instance`, () => {
        db = knex({
            client: "pg",
            connection: process.env.DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', ()=> db.destroy())

    beforeEach('clean the table', () => helpers.truncTables(db))

    afterEach('cleanup', () => helpers.truncTables(db))

    

    describe(`POST /api/users`, () => {
        
        const requiredFields = ['username', 'password']

        requiredFields.forEach(field => {
            const registerAttemptBody = {
                username: 'test username',
                password: 'test password'
            }

            it(`responds with 400 required error when ${field} is missing`, () => {
                delete registerAttemptBody[field]

                return supertest(app)
                    .post('/api/users')
                    .send(registerAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in the request body.`
                    })
            })
        })

        it(`responds with 400 'Please create a password longer than 8 characters.' when empty password`, () => {
            const shortPass = {
                username: 'short username',
                password: '1'
            }

            return supertest(app)
                .post('/api/users')
                .send(shortPass)
                .expect(400, {
                        error: `Please create a password longer than 8 characters.`
                })
        })

        it(`responds with 400 'Whoa, that's a crazy long password! Can you keep it under 72 characters? when long password`, () => {
            const longPass = {
                username: 'long username',
                password: '*'.repeat(73)
            }
            return supertest(app)
                .post('/api/users')
                .send(longPass)
                .expect(400, {error: `Whoa, that's a crazy long password! Can you keep it under 72 characters?`})
        })

        it(`responds 400 when password begins or ends with a space`, () => {
            const passSpaces = {
                username: 'space username',
                password: ' 2Sp@ces '
            }
            return supertest(app)
            .post('/api/users')
            .send(passSpaces)
            .expect(400, {error: `Please create a password that does not begin or end with an empty space.`})
        })

        it(`responds 400 error when password isn't complex enough`, () => {
            const weakPass = {
                username: 'weak username',
                password: '11AAaabb'
            }
            return supertest(app)
                .post('/api/users')
                .send(weakPass)
                .expect(400, {error: `Password must contain an uppercase letter, a lowercase letter, a number, and a special character.`})
        })

        it(`responds 400 when user name already taken`, () => {
            const userTaken = {
                username: testUser.username,
                password: 'B33ntaken!'
            }
            supertest(app) // VALID USER CREATION (user not taken)
            .post('/api/users')
            .send(userTaken)
            .expect(201);

            supertest(app) // INVALID USER CREATION (user taken)
            .post('/api/users')
            .send(userTaken)
            .expect(400, {error: `Sorry, that username has been taken.`})    
                
        })

        describe(`Given a valid user`, () => {
            it(`responds 201, serialized user with no password`, () => {
                const newUser = {
                    username: 'serialized username',
                    password: 'Password1!'
                    
                }
                
                return supertest(app)
                    .post('/api/users')
                    .set(`Authorization`, helpers.authHeader(testUser))
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                })
            })

            it(`stores the new user in db with bcrypted password`, () => {
                const newUser = {
                    username: 'crypt username',
                    password: '3ncrypted!'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(res =>
                        db
                        .from('user')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.username).to.eql(newUser.username)

                            return crypt.compare(newUser.password, row.password)
                        })
                        .then(compare => {
                            expect(compare).to.be.true
                        })
                    )
                    
            })
        })
    })
})
