import { UnauthorizedException } from "@/shared/exceptions/exceptions";
import * as jose from "jose";
import { authConfig } from "@/config/auth.config";
import { FastifyRequest } from "fastify";

type PayloadType = {
  userId: string;
};

export async function verifyJWT(request: FastifyRequest) {
  const bearer = request.headers["authorization"];
  if (!bearer) {
    throw new UnauthorizedException("Unauthorized");
  }

  const token = bearer.split(" ")[1];
  const secret = new TextEncoder().encode(authConfig.secretKey);
  const decoded = await jose.jwtVerify<PayloadType>(token, secret);

  const { userId, exp } = decoded.payload;

  const isTokenExpired = exp && exp < Date.now() ? true : false;
  if (!isTokenExpired) {
    throw new UnauthorizedException("Unauthorized");
  }

  request.userId = userId;
}
