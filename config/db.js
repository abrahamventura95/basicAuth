import mongoose from "mongoose";
import { config as _config } from "dotenv";
_config();
const uri = process.env.DB_URI;
const port = process.env.DB_PORT || 27017;
const name = process.env.DB_NAME;

const url = `mongodb://${uri}:${port}/${name}`;

export const connectDB = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
