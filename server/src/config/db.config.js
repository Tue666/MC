const mongoose = require("mongoose");
const { dbConfig } = require(".");

const connect = async () => {
  const { mongo_db_uri } = dbConfig;
  try {
    await mongoose.connect(mongo_db_uri, () => {
      console.log("DB connection successful");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect };
