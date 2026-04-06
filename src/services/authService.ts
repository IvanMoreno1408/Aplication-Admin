import { usersHttpClient } from '../utils/httpClient';
import type { AuthResponse } from '../models/AuthResponse';

const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    // La API espera query params, no JSON body
    const res = await usersHttpClient.post<{ token: string; error?: string }>(
      '/api/auth/login',
      null,
      {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
      }
    );

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    // La API solo devuelve el token, construimos el user con el email
    return {
      token: res.data.token,
      user: {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'admin',
      },
    };
  },
};

export default authService;
