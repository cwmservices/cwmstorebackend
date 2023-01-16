require("dotenv").config();
const mongoose = require("mongoose");

dbURL = process.env.URL;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbURL, {useNewUrlParser: true,useUnifiedTopology: true,});  
    console.log("Connection to database has been successful");
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = { connectDB };

