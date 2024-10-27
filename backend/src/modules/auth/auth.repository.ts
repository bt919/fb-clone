import { PrismaClient } from "@prisma/client";
import short from "short-uuid";

type UserData = {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  birthday: Date;
};

export class AuthRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async create(data: UserData): Promise<string | null> {
    const newUser = await this.db.users.create({
      data: {
        public_id: short.generate(),
        email: data.email,
        hashed_password: data.hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender as unknown as "male" | "female" | "other",
        birthday: data.birthday,
      },
    });

    return newUser.email;
  }

  async get(email: string): Promise<UserData & { userId: string }> {
    const user: Array<UserData & { userId: string }> = await this.db.$queryRaw`
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
