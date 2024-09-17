type UserPayload = {
  sub: number;
  email: string;
  accessToken: string;
};

type AuthInput = {
  email: string;
  password: string;
};

type SignInData = {
  userId: number;
  email: string;
};

declare namespace Express {
  export interface Request {
    user: omit<'accessToken', UserPayload>;
  }
}
