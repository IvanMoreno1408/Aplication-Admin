const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export async function uploadImage(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error('Falta configurar VITE_IMGBB_API_KEY');
  }

  const base64 = await fileToBase64(file);
  // Quitar el prefijo "data:image/...;base64,"
  const base64Data = base64.split(',')[1];

  const formData = new FormData();
  formData.append('image', base64Data);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Error al subir la imagen');
  }

  const json = await res.json();
  const url = json.data?.image?.url
    ?? json.data?.thumb?.url
    ?? json.data?.medium?.url
    ?? json.data?.display_url
    ?? json.data?.url;

  if (!url) {
    throw new Error('No se pudo obtener la URL de la imagen');
  }

  return url as string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
