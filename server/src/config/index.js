const dbConfig = {
  mongoDbUri: process.env.MONGODB_URI,
};

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const secret = {
  signature: process.env.SECRET_SIGNATURE,
};

module.exports = { dbConfig, cloudinaryConfig, secret };
