export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  tipo: string;
  precio: number;
  activo: boolean;
}

export type CreateProductDto = Omit<Product, 'id'>;
export type UpdateProductDto = Partial<CreateProductDto>;
