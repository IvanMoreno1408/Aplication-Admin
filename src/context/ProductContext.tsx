import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../models/Product';

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ProductContext.Provider value={{ products, loading, error, setProducts, setLoading, setError }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProductContext must be used within a ProductProvider');
  return ctx;
}
