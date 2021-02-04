const knex = require('knex');
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { JWT_SECRET, JWT_EXPIRY } = require('../src/config')

describe('Auth Endpoints', () => {
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

    after('disconnect from db', () => db.destroy())

    before(`cleanup`, () => helpers.truncUserTable(db))

    afterEach(`cleanup`, () => helpers.truncUserTable(db))

    describe(`POST /api/auth/token`, () => {
        beforeEach(`insert users`, () => 
            helpers.seedUsers(db, testUsers)
        )

        const requiredFields = ['username', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                password: testUser.password
            }

            it(`responds with 400 required error when ${field} is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/token')
                    .send(loginAttemptBody)
                    .expect(400, {error: `Missing '${field}' in the request body.`})
            })
        })

    it(`responds 400 'invalid username or password' when bad password`, () => {
        const invalidUser = {username: 'invalid', password: 'existy'}

        return supertest(app)
            .post('/api/auth/token')
            .send(invalidUser)
            .expect(400, {error: `Incorrect username or password.`})
    })

    it(`responds 400 'invalid username or password' when bad password`, () => {
        const invalidPass = {username: testUser.username, password: 'incorrect'}

        return supertest(app)
            .post('/api/auth/token')
            .send(invalidPass)
            .expect(400, {error: `Incorrect username or password.`})
    })

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        const validCred = {
            username: testUser.username,
            password: testUser.password
        }

        const expectedToken = jwt.sign(
            {user_id: testUser.id},
            JWT_SECRET,
            {
                subject: testUser.username,
                expiresIn: JWT_EXPIRY,
                algorithm: 'HS256'
            }
        )
        return supertest(app)
            .post('/api/auth/token')
            .send(validCred)
            .expect(200, {authToken: expectedToken})
    })
})

    describe(`PATCH /api/auth/token`, () => {
        beforeEach(`insert users`, () => 
            helpers.seedUsers(db, testUsers)
        )

        it(`responds 200 and JWT auth token using secret`, () => {
            const expectedToken = jwt.sign(
                {user_id: testUser.id},
                JWT_SECRET,
                {subject: testUser.username, expiresIn: JWT_EXPIRY, algorithm: 'HS256'}
            )
            return supertest(app)
                .put('/api/auth/token')
                .set('Authorization', helpers.authHeader(testUser))
                .expect(200, {authToken: expectedToken})
        })
    })
})