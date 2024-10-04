import prisma from "@/shared/db/connection";

export async function signUp(ctx) {
  const { email, password } = ctx;

  const userExists = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  if (userExists) {
    return new Error("User exists");
  }
}
