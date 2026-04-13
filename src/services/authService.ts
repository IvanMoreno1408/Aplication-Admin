import { usersHttpClient } from '../utils/httpClient';
import type { AuthResponse } from '../models/AuthResponse';

const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await usersHttpClient.post<{ token?: string; error?: string }>(
      '/api/auth/login',
      null,
      {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
        // No lanzar excepción en 401 — lo manejamos manualmente
        validateStatus: (status) => status < 500,
      }
    );

    // Si la respuesta tiene error o el status es 401/403
    if (res.status === 401 || res.status === 403 || res.data.error) {
      const msg = res.data.error ?? 'Correo o contraseña incorrectos.';
      throw new Error(msg);
    }

    if (!res.data.token) {
      throw new Error('Respuesta inesperada del servidor.');
    }

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
