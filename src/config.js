
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL
      || 'postgres://qnxpouhxbvnttw:527024e2bcea308a057ca2cb9d15c30ad8fe768549b9ba917450b12684b08334@ec2-18-205-44-21.compute-1.amazonaws.com:5432/d24i966cgkjm18',
    JWT_SECRET: process.env.JWT_SECRET || 'canttouchthis',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
    API_TOKEN: process.env.API_TOKEN,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
  }
  
  
// postgresql://lili@localhost/travellers