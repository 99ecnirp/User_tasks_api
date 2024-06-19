import mongoose from "mongoose";
import { mongoConfig } from "../config";

const connectMongo = async () => {
  try {
    await mongoose.connect(
      `${mongoConfig.connectionString}/${mongoConfig.dbName}`
    );
  } catch (e) {
    //log error
    process.exit();
  }
};

export default connectMongo;
