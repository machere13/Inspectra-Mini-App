import { z } from 'zod';
import { ENDPOINTS, baseApi } from '@shared/api';
import { apiSuccessSchema } from '@shared/model';
import {
  loginRegisterResponseSchema,
  verifyEmailResponseSchema,
  type LoginRegisterRequest,
  type LoginRegisterResponse,
  type ResendCodeRequest,
  type VerifyEmailRequest,
  type VerifyEmailResponse,
} from '../model/types';

const loginRegisterFullResponseSchema = apiSuccessSchema(loginRegisterResponseSchema);
const verifyEmailFullResponseSchema = apiSuccessSchema(verifyEmailResponseSchema);
const resendResponseSchema = apiSuccessSchema(z.object({}).passthrough());

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    loginOrRegister: build.mutation<LoginRegisterResponse, LoginRegisterRequest>({
      query: body => ({ url: ENDPOINTS.authLogin, method: 'POST', body }),
      transformResponse: (res: unknown) => loginRegisterFullResponseSchema.parse(res).data,
    }),
    verifyEmail: build.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: body => ({ url: ENDPOINTS.authVerify, method: 'POST', body }),
      transformResponse: (res: unknown) => verifyEmailFullResponseSchema.parse(res).data,
      invalidatesTags: ['Profile'],
    }),
    resendCode: build.mutation<{ message?: string }, ResendCodeRequest>({
      query: body => ({ url: ENDPOINTS.authResend, method: 'POST', body }),
      transformResponse: (res: unknown) => {
        const parsed = resendResponseSchema.parse(res);
        return { message: parsed.message };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginOrRegisterMutation, useVerifyEmailMutation, useResendCodeMutation } =
  authApi;
