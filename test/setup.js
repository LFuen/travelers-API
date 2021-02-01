  
process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'canttouchthis'
process.env.JWT_EXPIRY = '3h'

require('dotenv').config()

process.env.DATABASE_URL = process.env.DATABASE_URL
  || "postgres://zussweygrlrnbd:613aafecc17b082c0dbda029a253e5bc976267dafb4a31fe8e83e9b31a22e2a1@ec2-34-235-240-133.compute-1.amazonaws.com:5432/d98u3n95e5h16"

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest