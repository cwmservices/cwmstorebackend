require("dotenv").config();
const mongoose = require("mongoose");

dbURL = process.env.URL;

export const connectDB = async () => {
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to database has been successful");
  })
  .catch((err) => {
    console.log(err);
  });
}
