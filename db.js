import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database is Connected!");
    })
    .catch((error) => {
      console.log(error);
    });
};

export default connectDB;
