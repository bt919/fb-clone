import { type PrismaClient } from "@prisma/client";

export default class UserService {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  createUser() {}

  findUser() {}

  findUsers() {}
}
