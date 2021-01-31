const app = require('../src/app')
const config = require('../src/config')

describe('App', () => {
    it(`GET / responds with 200 containing "How YOU doin'?"`, () => {
        return supertest(app)
        .get('/')
        .set(`Authorization`, `Bearer ${config.API_TOKEN}`)
        .expect(200, `How YOU doin'?`)
    })
})