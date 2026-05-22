import { ENDPOINTS, baseApi } from '@shared/api';
import type { ApiSuccess } from '@shared/model';
import type {
  LoginRegisterRequest,
  LoginRegisterResponse,
  ResendCodeRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../model/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    loginOrRegister: build.mutation<LoginRegisterResponse, LoginRegisterRequest>({
      query: body => ({ url: ENDPOINTS.authLogin, method: 'POST', body }),
      transformResponse: (res: ApiSuccess<LoginRegisterResponse>) => res.data,
    }),
    verifyEmail: build.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: body => ({ url: ENDPOINTS.authVerify, method: 'POST', body }),
      transformResponse: (res: ApiSuccess<VerifyEmailResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
    resendCode: build.mutation<{ message?: string }, ResendCodeRequest>({
      query: body => ({ url: ENDPOINTS.authResend, method: 'POST', body }),
      transformResponse: (res: ApiSuccess<{ message?: string }>) => res.data,
    }),
  }),
  overrideExisting: false,
});

export const { useLoginOrRegisterMutation, useVerifyEmailMutation, useResendCodeMutation } =
  authApi;
