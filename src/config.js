
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL
      || 'postgres://lfuen:&>K--n?OlR(Bfs9%4N6pPlTLeiqe@cqlz5glh6vqe.us-east-1.rds.amazonaws.com:5432/travelers',
    JWT_SECRET: process.env.JWT_SECRET || 'canttouchthis',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
    API_TOKEN: process.env.API_TOKEN,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
  }
  
  
// postgresql://lili@localhost/travellers