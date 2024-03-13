export interface TokenPayload {
  email: string;
  id: string;
}

export interface RequestWithUser extends Request {
  user: TokenPayload;
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
