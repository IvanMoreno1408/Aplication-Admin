import httpClient from '../utils/httpClient';
import type { Product, CreateProductDto, UpdateProductDto } from '../models/Product';

const productService = {
  getAll(): Promise<Product[]> {
    return httpClient.get<Product[]>('/api/productos').then((res) => res.data);
  },

  create(data: CreateProductDto): Promise<Product> {
    return httpClient
      .post<Product>('/api/productos', data)
      .then((res) => res.data);
  },

  // El PUT recibe el objeto completo en el body incluyendo imagenUrl
  update(id: number, data: UpdateProductDto): Promise<Product> {
    return httpClient
      .put<Product>(`/api/productos/${id}`, data)
      .then((res) => res.data);
  },

  delete(id: number): Promise<void> {
    return httpClient.delete(`/api/productos/${id}`).then(() => undefined);
  },
};

export default productService;
