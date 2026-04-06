import React, { useEffect } from 'react';
import { MetricCard } from '../components/organisms/MetricCard';
import { useProducts } from '../hooks/useProducts';

const DashboardPage: React.FC = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => { fetchProducts(); }, []);

  const total = products.length;
  const activos = products.filter((p) => p.activo).length;
  const tipos = new Set(products.map((p) => p.tipo)).size;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Productos" value={loading ? '...' : total} description="Productos registrados" accent="green" />
        <MetricCard title="Tipos" value={loading ? '...' : tipos} description="Categorías distintas" accent="yellow" />
        <MetricCard title="Activos" value={loading ? '...' : activos} description="Productos activos" accent="green" />
        <MetricCard title="Inactivos" value={loading ? '...' : total - activos} description="Productos inactivos" accent="default" />
      </div>
    </div>
  );
};

export default DashboardPage;
