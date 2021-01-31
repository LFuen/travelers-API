  
process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'canttouchthis'
process.env.JWT_EXPIRY = '3h'

require('dotenv').config()

process.env.DATABASE_URL = process.env.DATABASE_URL
  || "postgresql://lili@localhost/travellers"

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest