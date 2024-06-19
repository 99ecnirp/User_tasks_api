import joi from "joi";

const schema = joi
  .object({
    HOST: joi.string().required(),
    PORT: joi.number().required(),
    MONGO_CONNECTION_STRING: joi.string().required(),
    MONGO_DB_NAME: joi.string().required(),
    NODE_ENV: joi.string().allow("development", "production"),
    HASH_SALT_ROUND: joi.number().default(12),
    JWT_SECRET_KEY: joi.string().required(),
    JWT_EXPIRES_IN_HOURS: joi.number().required(),
  })
  .unknown()
  .required();

export default schema;
