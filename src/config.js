
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL
      || 'postgres://zussweygrlrnbd:613aafecc17b082c0dbda029a253e5bc976267dafb4a31fe8e83e9b31a22e2a1@ec2-34-235-240-133.compute-1.amazonaws.com:5432/d98u3n95e5h16',
    JWT_SECRET: process.env.JWT_SECRET || 'canttouchthis',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
    API_TOKEN: process.env.API_TOKEN,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
  }
  
  
// postgresql://lili@localhost/travellers