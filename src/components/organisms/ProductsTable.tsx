import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Product } from '../../models/Product';
import SearchBar from '../molecules/SearchBar';
import Pagination from '../molecules/Pagination';
import Spinner from '../atoms/Spinner';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, loading, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const uniqueTypes = useMemo(() => Array.from(new Set(products.map((p) => p.tipo))).sort(), [products]);

  // Reset to page 1 whenever the products list is replaced (e.g. after a CRUD refresh)
  // so the current page never points past the end of the new dataset.
  useEffect(() => { setPage(1); }, [products]);

  const handleSearch = useCallback((v: string) => {
    setSearchQuery(v);
    setPage(1);
  }, []);

  const handleTypeFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const filtered = useMemo(() =>
    products.filter((p) => {
      const matchesName = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter ? p.tipo === typeFilter : true;
      return matchesName && matchesType;
    }), [products, searchQuery, typeFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre..." className="flex-1" />
        <select
          value={typeFilter}
          onChange={handleTypeFilter}
          aria-label="Filtrar por tipo"
          className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        >
          <option value="">Todos los tipos</option>
          {uniqueTypes.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex justify-center items-center">
                    <Spinner size="lg" />
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {product.imagenUrl ? (
                      <img
                        src={product.imagenUrl}
                        alt={product.nombre}
                        className="h-12 w-12 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-12 w-12 rounded-md flex items-center justify-center text-xs text-gray-400 bg-gray-100 ${product.imagenUrl ? 'hidden' : ''}`}>
                      Sin imagen
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nombre}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{product.tipo}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">${product.precio.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.activo ? 'success' : 'default'}>
                      {product.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={() => onEdit(product)} className="px-3 py-1 text-xs">Editar</Button>
                      <Button variant="danger" onClick={() => onDelete(product)} className="px-3 py-1 text-xs">Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ProductsTable;
