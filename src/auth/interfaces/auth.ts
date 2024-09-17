export interface AuthResult {
  userId: number;
  email: string;
  accessToken: string;
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface SignInData {
  userId: number;
  email: string;
}
