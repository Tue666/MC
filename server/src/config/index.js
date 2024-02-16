const dbConfig = {
  mongoDbUri: process.env.MONGODB_URI,
};

const secret = {
  signature: process.env.SECRET_SIGNATURE,
};

module.exports = { dbConfig, secret };
