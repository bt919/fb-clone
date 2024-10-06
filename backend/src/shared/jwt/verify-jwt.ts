import { UnauthorizedException } from "@/shared/exceptions/exceptions";
import * as jose from "jose";
import { authConfig } from "@/config/auth.config";
import { FastifyRequest } from "fastify";

type PayloadType = {
  email: string;
};

export async function verifyJWT(request: FastifyRequest) {
  const bearer = request.headers["Authorization"];
  if (!bearer || bearer instanceof Array) {
    throw new UnauthorizedException("Unauthorized");
  }

  const token = bearer.split(" ")[0];
  const secret = new TextEncoder().encode(authConfig.secretKey);
  const decoded = await jose.jwtVerify<PayloadType>(token, secret);

  const { email, exp } = decoded.payload;
  const isTokenExpired = exp ? Date.now() < exp : false;
  if (!isTokenExpired) {
    throw new UnauthorizedException("Unauthorized");
  }

  request.email = email;
}
