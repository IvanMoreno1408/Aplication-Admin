import { useProductContext } from '../context/ProductContext';
import { useUIContext } from '../context/UIContext';
import productService from '../services/productService';
import type { CreateProductDto, UpdateProductDto } from '../models/Product';

export function useProducts() {
  const { products, loading, error, setProducts, setLoading, setError } =
    useProductContext();
  const { showToast } = useUIContext();

  async function fetchProducts(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      const isTimeout = err instanceof Error && (err.message.includes('timeout') || (err as { code?: string }).code === 'ECONNABORTED');
      const message = isTimeout
        ? 'El servidor tardó demasiado. Intenta de nuevo.'
        : err instanceof Error ? err.message : 'Error al cargar productos';
      setError(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(data: CreateProductDto): Promise<void> {
    setLoading(true);
    try {
      await productService.create(data);
      const updated = await productService.getAll();
      setProducts(updated);
      showToast('success', 'Producto creado correctamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProduct(id: number, data: UpdateProductDto): Promise<void> {
    setLoading(true);
    try {
      await productService.update(id, data);
      const updated = await productService.getAll();
      setProducts(updated);
      showToast('success', 'Producto actualizado correctamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar producto';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number): Promise<void> {
    setLoading(true);
    try {
      await productService.delete(id);
      const updated = await productService.getAll();
      setProducts(updated);
      showToast('success', 'Producto eliminado correctamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
