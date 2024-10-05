import env from "env-var";

export const databaseConfig = {
  connection: env.get("DATABASE_URL").required().asString(),
};
