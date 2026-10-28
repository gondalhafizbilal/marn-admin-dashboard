import { API_ENDPOINTS } from "@/constants";

import { api } from "../api";

export type RegisterUserPayload = {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
};

export type LoginUserPayload = {
  emailAddress: string;
  password: string;
};

export type RequestPasswordResetPayload = {
  emailAddress: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthApiUser = {
  id: string;
  fullName?: string;
  emailAddress?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  role?: "super_admin" | "agency_admin" | "employee" | "client";
  agencyId?: string;
  avatarUrl?: string;
};

export type UserAuthResponse = {
  user: AuthApiUser;
  accessToken: string;
  refreshToken?: string;
};

class AuthRepositoryClass {
  private normalizeUser(user: any): AuthApiUser {
    if (!user) return user;

    return {
      id: user.uuid ?? user.id,
      fullName: user.full_name ?? user.fullName ?? user.name,
      emailAddress: user.email_address ?? user.email ?? user.emailAddress,
      phoneNumber: user.phone_number ?? user.phoneNumber ?? user.phone,
      countryCode: user.country_code ?? user.countryCode,
      role: user.role,
      agencyId: user.agency_id ?? user.agencyId,
      avatarUrl: user.profile_image_url ?? user.avatar_url ?? user.avatarUrl,
    };
  }

  async register(payload: RegisterUserPayload) {
    const res = await api.post<UserAuthResponse, RegisterUserPayload>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );

    return {
      ...res,
      user: this.normalizeUser(res.user) as AuthApiUser,
    } as UserAuthResponse;
  }

  async login(payload: LoginUserPayload) {
    const res = await api.post<UserAuthResponse, LoginUserPayload>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return {
      ...res,
      user: this.normalizeUser(res.user) as AuthApiUser,
    } as UserAuthResponse;
  }

  async logout() {
    // backend requires Authorization header; interceptors add it from storage
    try {
      await api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // swallow network errors — we'll still clear local session
    }
  }

  async requestPasswordReset(payload: RequestPasswordResetPayload) {
    await api.post<void, RequestPasswordResetPayload>(
      API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
      payload,
    );
  }

  async resetPassword(payload: ResetPasswordPayload) {
    await api.post<void, ResetPasswordPayload>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
    );
  }
}

export const AuthRepository = new AuthRepositoryClass();
