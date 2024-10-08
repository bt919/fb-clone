import db from "@/shared/db/connection";
import short from "short-uuid";

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

  async get(email: string): Promise<UserData & { userId: string }> {
    const user: Array<UserData & { userId: string }> = await db.$queryRaw`
                        SELECT email, hashed_password AS "hashedPassword",
                            public_id AS "userId", 
                            first_name AS "firstName", 
                            last_name AS "lastName", gender
                        FROM users
                        WHERE users.email = ${email}`;

    return user[0];
  }
}

export type AuthRepositoryType = typeof AuthRepository;
