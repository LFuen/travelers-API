const app = require('../src/app')

describe('App', () => {
    it('GET / responds with 200 containing "Hey now, it works!"', () => {
        return supertest(app).get('/').expect(200, 'Hey now, it works!')
    })
})