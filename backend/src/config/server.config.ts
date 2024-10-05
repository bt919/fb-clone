import env from "env-var";

export const serverConfig = {
  environment: env
    .get("NODE_ENV")
    .required()
    .asEnum(["development", "production", "test", "local"]),
  port: env.get("PORT").required().asPortNumber(),
};
