const serverConfig = {
  port: process.env.PORT,
  connection_state_recovery_duration:
    process.env.CONNECTION_STATE_RECOVERY_DURATION,
  ping_interval: process.env.PING_INTERVAL,
  ping_timeout: process.env.PING_TIMEOUT,
  signature: process.env.SECRET_SIGNATURE,
};

const dbConfig = {
  mongo_db_uri: process.env.MONGODB_URI,
};

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = { serverConfig, dbConfig, cloudinaryConfig };
