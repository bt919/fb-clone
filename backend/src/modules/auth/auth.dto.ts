import { Static, Type } from "@sinclair/typebox";

enum Gender {
  "male",
  "female",
  "other",
}

export const User = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  firstName: Type.String({ minLength: 1, maxLength: 50 }),
  lastName: Type.String({ minLength: 1, maxLength: 50 }),
  gender: Type.Enum(Gender),
});

export const UserCredentials = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export type UserType = Static<typeof User>;
export type UserCredentialsType = Static<typeof UserCredentials>;
