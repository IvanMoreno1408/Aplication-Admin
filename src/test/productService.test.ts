import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  usersHttpClient: { post: vi.fn() },
}));

import httpClient from '../utils/httpClient';
import productService from '../services/productService';
import type { Product } from '../models/Product';

const mockProduct: Product = {
  id: 1,
  nombre: 'Salchicha Test',
  descripcion: 'Descripción',
  imagenUrl: 'https://i.ibb.co/test.jpg',
  tipo: 'Salchicha',
  precio: 5.0,
  activo: true,
};

describe('productService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll retorna lista de productos', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: [mockProduct] });

    const result = await productService.getAll();

    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Salchicha Test');
    expect(httpClient.get).toHaveBeenCalledWith('/api/productos');
  });

  it('create envía imagenUrl como query param', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({ data: mockProduct });

    await productService.create({
      nombre: 'Nuevo',
      descripcion: 'Desc',
      imagenUrl: 'https://i.ibb.co/img.jpg',
      tipo: 'Chorizo',
      precio: 3.0,
      activo: true,
    });

    expect(httpClient.post).toHaveBeenCalledWith(
      '/api/productos',
      expect.not.objectContaining({ imagenUrl: expect.anything() }),
      expect.objectContaining({ params: { imagenUrl: 'https://i.ibb.co/img.jpg' } })
    );
  });

  it('delete llama al endpoint correcto', async () => {
    vi.mocked(httpClient.delete).mockResolvedValue({ data: null });

    await productService.delete(1);

    expect(httpClient.delete).toHaveBeenCalledWith('/api/productos/1');
  });

  it('getAll maneja error de timeout', async () => {
    const timeoutError = new Error('timeout of 10000ms exceeded');
    (timeoutError as { code?: string }).code = 'ECONNABORTED';
    vi.mocked(httpClient.get).mockRejectedValue(timeoutError);

    await expect(productService.getAll()).rejects.toThrow('timeout');
  });
});
