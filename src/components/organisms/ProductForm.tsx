import React, { useState, useEffect, useRef } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import type { Product, CreateProductDto } from '../../models/Product';

const IMGBB_API_KEY = '29bfea99aa30ac4112ec43eac8554d9c';

async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir imagen');
  const json = await res.json();
  // Intentar diferentes campos de URL que provee imgbb
  const url = json.data?.image?.url      // URL directa del archivo
    ?? json.data?.thumb?.url             // Thumbnail
    ?? json.data?.medium?.url            // Tamaño medio
    ?? json.data?.display_url            // URL de display
    ?? json.data?.url;                   // URL general
  if (!url) throw new Error('No se pudo obtener la URL de la imagen');
  return url as string;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormValues {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  tipo: string;
  precio: string;
  activo: boolean;
}

interface FormErrors {
  nombre?: string;
  tipo?: string;
  imagenUrl?: string;
  precio?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.nombre.trim() || values.nombre.trim().length < 2)
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
  if (!values.tipo.trim())
    errors.tipo = 'El tipo es requerido.';
  if (!values.imagenUrl.trim())
    errors.imagenUrl = 'La imagen es requerida.';
  if (isNaN(Number(values.precio)) || Number(values.precio) < 0)
    errors.precio = 'El precio debe ser un número válido.';
  return errors;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [values, setValues] = useState<FormValues>({
    nombre: '', descripcion: '', imagenUrl: '', tipo: '', precio: '0', activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setValues({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion,
        imagenUrl: initialData.imagenUrl,
        tipo: initialData.tipo,
        precio: String(initialData.precio),
        activo: initialData.activo,
      });
      setPreviewUrl(initialData.imagenUrl);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate({ ...values, [name]: e.target.value });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormErrors] }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setErrors((prev) => ({ ...prev, imagenUrl: undefined }));

    try {
      const url = await uploadToImgbb(file);
      console.log('URL imgbb obtenida:', url);
      setValues((prev) => ({ ...prev, imagenUrl: url }));
      setPreviewUrl(url);
    } catch {
      setErrors((prev) => ({ ...prev, imagenUrl: 'Error al subir la imagen. Intenta de nuevo.' }));
      setValues((prev) => ({ ...prev, imagenUrl: '' }));
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, tipo: true, imagenUrl: true, precio: true });
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length === 0 && !uploading) {
      onSubmit({
        nombre: values.nombre.trim(),
        descripcion: values.descripcion.trim(),
        imagenUrl: values.imagenUrl.trim(),
        tipo: values.tipo.trim(),
        precio: Number(values.precio),
        activo: values.activo,
      });
    }
  };

  const isDisabled = loading || uploading;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField label="Nombre" id="nombre" name="nombre" value={values.nombre}
        onChange={handleChange} onBlur={handleBlur} placeholder="Nombre del producto"
        disabled={isDisabled} error={touched.nombre ? errors.nombre : undefined} />

      <FormField label="Descripción" id="descripcion" name="descripcion" value={values.descripcion}
        onChange={handleChange} onBlur={handleBlur} placeholder="Descripción del producto"
        disabled={isDisabled} />

      {/* Imagen */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Imagen del producto</label>

        {previewUrl && (
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2" style={{ borderColor: '#2d7a2d' }}>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isDisabled}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2d7a2d' }}>
          {uploading ? (
            <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Subiendo...</>
          ) : (
            <>{previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}</>
          )}
        </button>

        {values.imagenUrl && !uploading && (
          <span className="text-xs font-medium" style={{ color: '#2d7a2d' }}>✓ Imagen lista</span>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {/* También permitir ingresar URL manualmente */}
        <div className="mt-1">
          <label className="text-xs text-gray-500">O pega una URL de imagen:</label>
          <input
            type="text"
            value={values.imagenUrl === 'pending' ? '' : values.imagenUrl}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, imagenUrl: e.target.value }));
              setPreviewUrl(e.target.value);
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="block w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-xs text-gray-600 focus:outline-none focus:ring-1"
            style={{ borderColor: '#e5e7eb' }}
          />
        </div>

        {touched.imagenUrl && errors.imagenUrl && (
          <span className="text-sm text-red-600" role="alert">{errors.imagenUrl}</span>
        )}
      </div>

      <FormField label="Tipo" id="tipo" name="tipo" value={values.tipo}
        onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Salchicha Americana"
        disabled={isDisabled} error={touched.tipo ? errors.tipo : undefined} />

      <FormField label="Precio" id="precio" name="precio" type="number" value={values.precio}
        onChange={handleChange} onBlur={handleBlur} placeholder="0.00"
        disabled={isDisabled} error={touched.precio ? errors.precio : undefined} />

      <div className="flex items-center gap-2">
        <input id="activo" name="activo" type="checkbox" checked={values.activo}
          onChange={handleChange} disabled={isDisabled} className="h-4 w-4 border-gray-300 rounded" />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">Activo</label>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isDisabled}>Cancelar</Button>
        <Button type="submit" variant="primary" disabled={isDisabled}>
          {loading ? 'Guardando...' : uploading ? 'Subiendo imagen...' : initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
