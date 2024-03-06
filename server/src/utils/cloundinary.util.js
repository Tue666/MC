const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../config");

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

class CloudinaryUtil {
  static async upload(file, options = {}) {
    return await cloudinary.uploader.upload(file, options);
  }

  static async destroy(public_id, options = {}) {
    return await cloudinary.uploader.destroy(public_id, options);
  }
}

module.exports = CloudinaryUtil;
