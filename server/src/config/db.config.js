const mongoose = require("mongoose");
const { dbConfig } = require(".");

const connect = async () => {
  const { mongoDbUri } = dbConfig;
  try {
    await mongoose.connect(mongoDbUri, () => {
      console.log("DB connection successful");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect };
