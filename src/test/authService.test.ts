import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del cliente HTTP
vi.mock('../utils/httpClient', () => ({
  usersHttpClient: {
    post: vi.fn(),
  },
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { usersHttpClient } from '../utils/httpClient';
import authService from '../services/authService';

describe('authService.login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('devuelve AuthResponse con token válido', async () => {
    vi.mocked(usersHttpClient.post).mockResolvedValue({
      status: 200,
      data: { token: 'abc123' },
    });

    const result = await authService.login({ email: 'admin@test.com', password: '1234' });

    expect(result.token).toBe('abc123');
    expect(result.user.email).toBe('admin@test.com');
  });

  it('lanza error cuando la API devuelve 401', async () => {
    vi.mocked(usersHttpClient.post).mockResolvedValue({
      status: 401,
      data: { error: 'Credenciales invalidas' },
    });

    await expect(authService.login({ email: 'x@x.com', password: 'wrong' }))
      .rejects.toThrow('Credenciales invalidas');
  });

  it('lanza error cuando la API devuelve error en data', async () => {
    vi.mocked(usersHttpClient.post).mockResolvedValue({
      status: 200,
      data: { error: 'Usuario no encontrado' },
    });

    await expect(authService.login({ email: 'x@x.com', password: '1234' }))
      .rejects.toThrow('Usuario no encontrado');
  });

  it('lanza error cuando no hay token en la respuesta', async () => {
    vi.mocked(usersHttpClient.post).mockResolvedValue({
      status: 200,
      data: {},
    });

    await expect(authService.login({ email: 'x@x.com', password: '1234' }))
      .rejects.toThrow('Respuesta inesperada del servidor.');
  });
});
