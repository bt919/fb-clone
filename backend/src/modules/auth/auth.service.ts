import argon from "@node-rs/argon2";
import { authConfig } from "@/config/auth.config";
import { AuthRepository } from "./auth.repository";
import {
  BadRequestException,
  UnauthorizedException,
} from "@/shared/exceptions/exceptions";
import * as jose from "jose";
import { UserType, UserCredentialsType } from "./auth.dto";

export async function signUp(
  payload: UserType,
  authRepository: AuthRepository,
) {
  const userExists = await authRepository.get(payload.email);
  if (userExists) {
    throw new BadRequestException("Email in use");
  }

  const hash = await argon.hash(payload.password);

  const newUser = await authRepository.create({
    email: payload.email,
    hashedPassword: hash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    gender: payload.gender as unknown as "male" | "female" | "other",
  });

  return true;
}

export async function signIn(
  payload: UserCredentialsType,
  authRepository: AuthRepository,
) {
  const userExists = await authRepository.get(payload.email);
  if (!userExists) {
    throw new UnauthorizedException("Email or password incorrect");
  }

  const isPasswordCorrect = await argon.verify(
    userExists.hashedPassword,
    payload.password,
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedException("Email or password incorrect");
  }

  const secret = new TextEncoder().encode(authConfig.secretKey);
  const token = await new jose.SignJWT({ userId: userExists.userId })
    .setExpirationTime(authConfig.jwtExpiresIn)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return token;
}