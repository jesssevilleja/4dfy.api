export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/4dfy',
  },
  web: {
    url: process.env.SHOP_URL || 'http://127.0.0.1:3001',
  },
  auth: {
    tokenSecret:
      process.env.AUTH_ACCESS_TOKEN_SECRET || 'AUTH_ACCESS_TOKEN_SECRET',
    tokenExpiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRE || '1h',
    refreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'AUTH_REFRESH_TOKEN_SECRET',
    refreshTokenExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRE || '3d',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'clientID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'clientSecret',
  },
});
