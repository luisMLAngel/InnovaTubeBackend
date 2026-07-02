export interface JwtPayload {
  sub: string; // userId
  email?: string;
  type?: 'access' | 'refresh';
}

export interface JwtValidatedUser {
  userId: string;
  email: string;
  type?: 'access' | 'refresh';
}
