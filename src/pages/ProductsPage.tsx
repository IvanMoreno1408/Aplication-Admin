import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductsTable from '../components/organisms/ProductsTable';
import ProductForm from '../components/organisms/ProductForm';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import Button from '../components/atoms/Button';
import type { Product, CreateProductDto } from '../models/Product';

const ProductsPage: React.FC = () => {
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const handleCreateSubmit = async (data: CreateProductDto) => {
    await createProduct(data);
    setShowForm(false);
  };

  const handleEditSubmit = async (data: CreateProductDto) => {
    if (!selectedProduct) return;
    await updateProduct(selectedProduct.id, data);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <Button variant="primary" onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
          Nuevo producto
        </Button>
      </div>

      {(showForm || selectedProduct) && (
        <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {selectedProduct ? 'Editar producto' : 'Crear producto'}
          </h2>
          <ProductForm
            initialData={selectedProduct ?? undefined}
            onSubmit={selectedProduct ? handleEditSubmit : handleCreateSubmit}
            onCancel={() => { setShowForm(false); setSelectedProduct(null); }}
            loading={loading}
          />
        </div>
      )}

      <ProductsTable
        products={products}
        loading={loading}
        onEdit={(p) => { setShowForm(false); setSelectedProduct(p); }}
        onDelete={(p) => { setProductToDelete(p); setShowDeleteDialog(true); }}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteDialog(false); setProductToDelete(null); }}
      />
    </div>
  );
};

export default ProductsPage;
