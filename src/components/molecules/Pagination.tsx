import React from 'react';
import Button from '../atoms/Button';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <label htmlFor="page-size-select" className="text-sm text-gray-600">
          Por página:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-2 py-1 text-xs">
            Anterior
          </Button>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-2 py-1 text-xs">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
