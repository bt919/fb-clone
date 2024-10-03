import { get } from "env-var";

export const serverConfig = {
  environment: get("NODE_ENV")
    .required()
    .asEnum(["development", "production", "test", "local"]),
  port: get("PORT").required().asPortNumber(),
};
