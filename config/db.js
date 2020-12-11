const mongoose = require("mongoose");

const dbURI = process.env.MONGO_DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to DB");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
