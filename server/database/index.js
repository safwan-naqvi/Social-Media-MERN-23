const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`Database connected to host ${conn.connection.host}`);
  } catch (e) {
    console.log(`Error is ${e}`);
  }
};

module.exports = dbConnect;
