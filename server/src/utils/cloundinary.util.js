const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../config");

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

class CloudinaryUtil {
  static async upload(file, options = {}) {
    if (Array.isArray(file)) {
      const uploaded = await Promise.all(
        file.map(async (value) => {
          const { public_id } = await cloudinary.uploader.upload(
            value.path,
            options
          );
          return public_id;
        })
      );

      return uploaded;
    }

    const { public_id } = await cloudinary.uploader.upload(file.path, options);
    return [public_id];
  }

  static async destroy(public_id, options = {}) {
    if (Array.isArray(public_id)) {
      return await Promise.all(
        public_id.map(async (id) => {
          await cloudinary.uploader.destroy(id, options);
        })
      );
    }

    return await cloudinary.uploader.destroy(public_id, options);
  }
}

module.exports = CloudinaryUtil;
