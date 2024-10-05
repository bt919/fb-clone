import env from "env-var";
import dotenv from "dotenv";
dotenv.config();

export const authConfig = {
  secretKey: env.get("SECRET_KEY").required().asString(),
  jwtExpiresIn: env.get("JWT_EXPIRES_IN").required().asString(),
};
