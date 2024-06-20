import mongoose from "mongoose";
import { mongoConfig } from "../config";

const connectMongo = async () => {
  try {

    //checking the connection with mongodb
    await mongoose.connect(
      `${mongoConfig.connectionString}/${mongoConfig.dbName}`
    );
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

export default connectMongo;
