import { Static, Type } from "@sinclair/typebox";

export const User = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export type UserType = Static<typeof User>;
