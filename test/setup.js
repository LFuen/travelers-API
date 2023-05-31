  
process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'canttouchthis'
process.env.JWT_EXPIRY = '3h'

require('dotenv').config()

process.env.DATABASE_URL = process.env.DATABASE_URL
  || "postgres://qnxpouhxbvnttw:527024e2bcea308a057ca2cb9d15c30ad8fe768549b9ba917450b12684b08334@ec2-18-205-44-21.compute-1.amazonaws.com:5432/d24i966cgkjm18"

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest