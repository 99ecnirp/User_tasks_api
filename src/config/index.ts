import dotenv from "dotenv";
import schema from "./schema";

dotenv.config();
const { error, value: envVars } = schema.validate(process.env);
if (error) {
  console.log(error);
  process.exit();
}

const appConfig = {
  port: envVars.PORT,
  host: envVars.HOST,
  env: envVars.NODE_ENV,
};

const mongoConfig = {
  connectionString: envVars.MONGO_CONNECTION_STRING,
  dbName: envVars.MONGO_DB_NAME,
};

const authConfig = {
  hashSaltround: envVars.HASH_SALT_ROUND,
};

const jwtconfig = {
  secretKey: envVars.JWT_SECRET_KEY,
  expiresInHours: envVars.JWT_EXPIRES_IN_HOURS
};

export { appConfig, mongoConfig, authConfig, jwtconfig };
