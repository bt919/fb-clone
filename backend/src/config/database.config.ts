import { get } from "env-var";

export const databaseConfig = {
  connection: get("DATABASE_URL").required().asString(),
};
