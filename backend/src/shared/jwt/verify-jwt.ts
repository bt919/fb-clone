import { UnauthorizedException } from "@/shared/exceptions/exceptions";
import * as jose from "jose";
import { authConfig } from "@/config/auth.config";

type PayloadType = {
  email: string;
};

export async function verifyJWT(req) {
  const bearer = req.headers.authorization;
  if (!bearer) {
    throw new UnauthorizedException("Unauthorized");
  }

  const token = bearer.split(" ")[1];
  const secret = new TextEncoder().encode(authConfig.secretKey);
  const decoded = await jose.jwtVerify<PayloadType>(token, secret);

  const { email, exp } = decoded.payload;
  const isTokenExpired = exp ? Date.now() < exp : false;
  if (!isTokenExpired) {
    throw new UnauthorizedException("Unauthorized");
  }

  req.email = email;
}
