import argon from "@node-rs/argon2";
import db from "@/shared/db/connection";
import short from "short-uuid";
import { UserType } from "./auth.dto";

type UserData = {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
};

export class AuthRepository {
  async create(data: UserData): Promise<string | null> {
    const newUser = await db.users.create({
      data: {
        public_id: short.generate(),
        email: data.email,
        hashed_password: data.hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender as unknown as "male" | "female" | "other",
      },
    });

    return newUser.email;
  }

  async get(email: string): Promise<UserData> {
    const user: UserData = await db.$queryRaw`
                        SELECT email, hashed_password AS hashedPassword, 
                            first_name AS firstName, 
                            last_name AS lastName, gender
                        FROM users
                        WHERE users.email = ${email}`[0];

    return user;
  }
}

export type AuthRepositoryType = typeof AuthRepository;
