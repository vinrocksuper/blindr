require('dotenv').config();

const connections = {
  development: {
    http: {
      port: 3000,
    },
    mongo: process.env.MONGODB_URI || 'mongodb://127.0.0.1/Blindr',
    redis: process.env.REDISCLOUD_URL,
  },
  production: {
    http: {
      port: process.env.PORT || process.env.NODE_PORT || 3000,
    },
    mongo: process.env.MONGODB_URI,
    redis: process.env.REDISCLOUD_URL,
  },
};

module.exports = {
  connections: connections[process.env.NODE_ENV],
  secret: process.env.SECRET,
};
