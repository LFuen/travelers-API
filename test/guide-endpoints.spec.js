const crypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')
const knex = require('knex')
const { expect } = require('chai')



describe(`Guide Endpoints`, () => {
    let db
    
    const testUsers = helpers.usersArray()
    const testUser = testUsers[0]

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

    beforeEach('clean the tables', () => helpers.truncTables(db))
   
    beforeEach(`insert users`, () => 
    helpers.seedUsers(db, testUsers)
    )
   
    afterEach('cleanup', () => helpers.truncTables(db))

    
    describe(`GET /api/guides`, () => {
        context("Given there are no guides in the database", () => {

            it(`responds with 200 and empty list`, () => {

            return supertest(app)
                .get("/api/guides")
                .set(`Authorization`, helpers.authHeader(testUser))
                .expect(200, []);
            });
        });

        context(`Given there are guides in the database`, () => {
            const testGuide = helpers.guidesArrayId();

            beforeEach(`insert guide`, () => {
            return db.into("guide").insert(testGuide);
            });

            it(`gets the guides from the store`, () => {
            return supertest(app)
                .get("/api/guides")
                .expect(200, testGuide);
            });
        });

        context(`Given an XSS atack on guides`, () => {
            const { badGuide, expectedGuide } = helpers.misGuide();

            beforeEach(`insert bad guide`, () => {
            return db.into("guide").insert([badGuide]);
            });

            it(`removes no bueno XSS attack content`, () => {
            return supertest(app)
                .get(`/api/guides`)
                .expect(200)
                .expect((res) => {
                expect(res.body[0].guide_type).to.eql(expectedGuide.guide_type);
                expect(res.body[0].city).to.eql(expectedGuide.city);
                expect(res.body[0].recommendation).to.eql(expectedGuide.recommendation);
                expect(res.body[0].comments).to.equal(expectedGuide.comments);
                });
            });
        });
        });

        describe(`GET /api/guides/:guide_id`, () => {
        context(`Given there are no guides in the database`, () => {
            
            it(`responds with 404`, () => {
            const guideId = 123456;
            return supertest(app)
                .get(`/api/guides/${guideId}`)
                .set(`Authorization`, helpers.authHeader(testUser))
                .expect(404, {
                error: { message: `Sorry, you've been misGUIDEed!` },
                });
            });
        });

        context(`Given there are guides in the database`, () => {
            const testGuides = helpers.guidesArrayId()

            beforeEach(`insert guides`, () => {
            return db.into("guide").insert(testGuides);
            });

            it(`responds with 200 and the specified guide`, () => {
            const guideId = 2;
            const expectedGuide = testGuides[guideId - 1];
            console.log("EXPECTED:", expectedGuide)
            return supertest(app)
                .get(`/api/guides/${guideId}`)
                .set(`Authorization`, helpers.authHeader(testUser))
                .expect(200, expectedGuide);
            });
        });

        context(`Given an XSS guide attack`, () => {
            const { badGuide, expectedGuide } = helpers.misGuide();

            beforeEach(`insert bad guide`, () => {
            return db.into("guide").insert([badGuide]);
            });

            it(`removes no bueno XSS attack content`, () => {
            return supertest(app)
                .get(`/api/guides/${badGuide.id}`)
                .set(`Authorization`, helpers.authHeader(testUser))
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.guide_type).to.eql(expectedGuide.guide_type);
                    expect(res.body.city).to.eql(expectedGuide.city);
                    expect(res.body.recommendation).to.eql(expectedGuide.recommendation);
                    expect(res.body.comments).to.equal(expectedGuide.comments);
                });
            });
        });
        });

        describe(`GET /api/guides`, () => {
        context("Given there are guides in the database", () => {
            const testGuides = helpers.guidesArrayId();

            beforeEach("new guide", () => {
            return db.into("guide").insert(testGuides);
            });

            it(`GET /api/guides responds with 200 and all of the guides`, () => {
            return supertest(app)
                .get("/api/guides")
                .set(`Authorization`, helpers.authHeader(testUser))
                .expect(200, testGuides);
            });
        });
        });

        describe(`GET /api/guides/:guide_id`, () => {
            context(`Given there are guides in the database`, () => {
                const testGuides = helpers.guidesArrayId();

                beforeEach("new guide", () => {
                return db.into("guide").insert(testGuides);
                });

                it(`responds with 200 and the specified guide`, () => {
                const guideId = 2;
                const expectedGuide = testGuides[guideId - 1];
                return supertest(app)
                    .get(`/api/guides/${guideId}`)
                    .set(`Authorization`, helpers.authHeader(testUser))
                    .expect(200, expectedGuide);
                });
            });

            context(`Given an xss attack on an order`, () => {
                const badGuide = {
                    id: 911,
                    guide_type: "Food",
                    city: "Evil City",
                    recommendation: 'Worst recommendation',
                    comments: "Rude comments",
                };
        
                beforeEach(`insert bad guide`, () => {
                return db.into("guide").insert([badGuide]);
                });
        
                it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/guides/${badGuide.id}`)
                .set(`Authorization`, helpers.authHeader(testUser))
                    .expect(200)
                    .expect((res) => {
                    expect(res.body.guide_type).to.eql("Food");
                    expect(res.body.city).to.eql("Evil City");
                    expect(res.body.recommendation).to.eql("Worst recommendation");
                    expect(res.body.comments).to.equal("Rude comments");
                    });
                });
            });
        });



    describe(`POST /api/guides`, () => {
        beforeEach('insert guides', () => {
            return db.into('guide').insert(testGuide)
        })

        const requiredFields = ['city', 'recommendation', 'comments']

        requiredFields.forEach(field => {
            const attemptBody = {
                id: 1,
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'test recommendation',
                comments: 'test comments'
            }

            it(`responds with 400 required error when ${field} is missing`, () => {
                attemptBody[field] = null

                return supertest(app)
                    .post('/api/guides')
                    .set(`Authorization`, helpers.authHeader(testUser))
                    .send(attemptBody)
                    .expect(400, {error: {
                        message: `Missing '${field}' in the request body.`
                    }
                })
            })
        })

        it(`responds with 400 'Missing 'city' in the request body.'`, () => {
            const missCity = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'test recommendation',
                comments: 'test comments'
            }
            delete missCity.city

            return supertest(app)
                .post('/api/guides')
                .set(`Authorization`, helpers.authHeader(testUser))
                .send(missCity)
                .expect(400, {error: {message: `Missing 'city' in the request body.`}})
        })

        it(`responds with 400 'Missing 'recommendation' in the request body.' when missing recommendation`, () => {
            const missRecom = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'missing recommendation',
                comments: 'test comments'
            }
            delete missRecom.recommendation

            return supertest(app)
                .post('/api/guides')
                .set(`Authorization`, helpers.authHeader(testUser))
                .send(missRecom)
                .expect(400, {error: {message: `Missing 'recommendation' in the request body.`}})
        })

        it(`responds 400 'Missing 'comments' in the request body.' when missing comments`, () => {
            const missComm = {
                guide_type: 'test guide',
                city: 'test city',
                recommendation: 'recommendation',
                comments: 'missing comments'
            }
            delete missComm.comments

            return supertest(app)
            .post('/api/guides')
            .set(`Authorization`, helpers.authHeader(testUser))
            .send(missComm)
            .expect(400, {error: {message: `Missing 'comments' in the request body.`}})
        })

        describe(`Given a valid guide`, () => {
            it(`responds 201, with new guide`, () => {
                const newGuide = {
                    id: 1,
                    guide_type: 'test guide',
                    city: 'test city',
                    recommendation: 'recommendation',
                    comments: 'missing comments'
                }

                return supertest(app)
                    .post('/api/guides')
                    .set(`Authorization`, helpers.authHeader(testUser))
                    .send(newGuide)
                    .expect(201)
                    .expect(res => {
                        console.log('this is the res', res.body)
                        expect(res.body).to.have.property('id')
                        expect(res.body.guide_type).to.eql(newGuide.guide_type)
                        expect(res.body.city).to.eql(newGuide.city)
                        expect(res.body.recommendation).to.eql(newGuide.recommendation)
                        expect(res.body.comments).to.eql(newGuide.comments)
                        expect(res.headers.location).to.eql(`/api/guides/${res.body.id}`)
                    })
                    .then(res =>
                        supertest(app)
                            .get(`/api/guides/${res.body.id}`)
                            .set(`Authorization`, helpers.authHeader(testUser))
                            .expect(res.body)
                    )
            })
        })
    })

    describe('DELETE /api/guides/:guide_id', () => {
        context('Given guide does not exist', () => {
            it('responds with 404', () => {
                const guideId = 12345
                return supertest(app)
                    .delete(`/api/guides/${guideId}`)
                .set(`Authorization`, helpers.authHeader(testUser))
                    .expect(404, {error: { message: `Sorry, you've been misGUIDEed!`}})
            })
        })

        context('Given there is a guide in the database matching is', () => {
            const testUsers = helpers.usersArray()
            const testGuides = helpers.guidesArrayId()

            beforeEach('insert guide', () => {
                return db
                    .into('guide').insert(testGuides)
            })

            it('responds with 204 and removes the guide', () => {
                const testGuide = testGuides[0]
                const idToRemove = 1
                const expectedGuides = testGuides.filter(
                    (guide) => guide.id !== idToRemove
                )
                return supertest(app)
                    .delete(`/api/guides/${idToRemove}`)
                    .set(`Authorization`, helpers.authHeader(testUser))
                    .expect(204)
                    .then((res) => 
                        supertest(app).get('/api/guides').expect(expectedGuides)
                    )
            })
        })
    })
})
