  
process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'canttouchthis'
process.env.JWT_EXPIRY = '3h'

require('dotenv').config()

process.env.DATABASE_URL = process.env.DATABASE_URL
  || 'postgres://lfuen:&>K--n?OlR(Bfs9%4N6pPlTLeiqe@cqlz5glh6vqe.us-east-1.rds.amazonaws.com:5432/travelers'

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest