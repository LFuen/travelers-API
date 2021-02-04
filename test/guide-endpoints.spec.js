const crypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')
const knex = require('knex')
const { expect } = require('chai')

describe(`Guide Endpoints`, () => {
    let db

    const testGuides = helpers.guidesArray()
    const testGuide = testGuides[0]    

    before(`make knex instance`, () => {
        db = knex({
            client: "pg",
            connection: process.env.DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', ()=> db.destroy())

    before('clean the table', () => helpers.truncGuideTable(db))

    afterEach('cleanup', () => helpers.truncGuideTable(db))

    

    describe(`POST /api/guides`, () => {
        beforeEach('insert guides', () => {
            return db.into('guide').insert(testGuide)
        })

        const requiredFields = ['guide_type', 'city', 'recommendation', 'comments']

        requiredFields.forEach(field => {
            const attemptBody = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'test recommendation',
                comments: 'test comments'
            }

            it(`responds with 400 required error when ${field} is missing`, () => {
                delete attemptBody[field]

                return supertest(app)
                    .post('/api/guides')
                    .send(attemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in the request body.`
                    })
            })
        })

        it(`responds with 400 'Please tell us what city this is in' when empty city`, () => {
            const missCity = {
                guide_type: 'test guide',
                city: 'missing city',
                recommendation: 'test recommendation',
                comments: 'test comments'
            }
            return supertest(app)
                .post('/api/guides')
                .send(missCity)
                .expect(400, {error: `Please tell us what city this is in.`})
        })

        it(`responds with 400 'What is is that you wanted to recommend?' when missing recommendation`, () => {
            const missRecom = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'missing recommendation',
                comments: 'test comments'
            }
            return supertest(app)
                .post('/api/guides')
                .send(missRecom)
                .expect(400, {error: `What is is that you wanted to recommend?`})
        })

        it(`responds 400 'Why is this worth recommending?' when missing comments`, () => {
            const missComm = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'recommendation',
                comments: 'missing comments'
            }
            return supertest(app)
            .post('/api/guides')
            .send(missComm)
            .expect(400, {error: `Why is this worth recommending?.`})
        })

        describe(`Given a valid guide`, () => {
            it(`responds 201, serialized guide with`, () => {
                const newGuide = {
                    guide_type: 'test guide',
                    city: 'test city',
                    recommendation: 'recommendation',
                    comments: 'test comments'
                }
                return supertest(app)
                    .post('/api/guides')
                    .send(newGuide)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.guide_type).to.eql(newGuide.guide_type)
                        expect(res.body.city).to.eql(newGuide.city)
                        expect(res.body.recommendation).to.eql(newGuide.recommendation)
                        expect(res.body.comments).to.eql(newGuide.comments)
                        expect(res.headers.location).to.eql(`/api/guides/${res.body.id}`)
                    })
            })
        })
    })

    describe('DELETE /api/guides', () => {
        context('Given guide does not exist', () => {
            it('responds with 404', () => {
                const guideId = 12345
                return supertest(app)
                    .delete(`/api/guides/${guideId}`)
                    .expect(404, {error: { message: `Sorry, you've been misGUIDEed!`}})
            })
        })

        context('Given there is a guide in the database matching is', () => {
            const testUsers = helpers.usersArray()
            const testGuides = helpers.guidesArray()

            beforeEach('insert guide', () => {
                return db
                    .into('user')
                    .insert(testUsers)
                    .then(() => {
                        return db.into('guide').insert(testGuides)
                    })
            })

            it('responds with 204 and removes the guide', () => {
                testGuides.forEach((guide) => {
                    guide.city = 'test city'
                    guide.comments = 'test comments'
                })
                const testGuides = helpers.guidesArray()
                const testGuide = testGuides[0]
                const idToRemove = 4
                const expectedGuides = testGuides.filter(
                    (guide) => guide.id !== idToRemove
                )
                return supertest(app)
                    .delete(`/api/guides/${idToRemove}`)
                    .set('Authorization', helpers.authHeader(testGuide))
                    .expect(204)
                    .then((res) => 
                        supertest(app).get('/api/guides').expect(expectedGuides)
                    )
            })
        })
    })
})
