import type { UserShort } from '@entities/user';

export interface LoginRegisterRequest {
  email: string;
  password: string;
}

export interface LoginRegisterResponse {
  requires_verification: true;
  email: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  token: string;
  user: UserShort;
}

export interface ResendCodeRequest {
  email: string;
}
