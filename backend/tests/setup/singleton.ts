import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

import db from "@/shared/db/connection";

jest.mock("@/shared/db/connection", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});
console.log("B -------------------------- B");

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;
