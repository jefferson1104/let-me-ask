export interface JWTPayload {
  email: string;
  provider: string;
  providerId: string;
  iat: number;
  exp: number;
}
