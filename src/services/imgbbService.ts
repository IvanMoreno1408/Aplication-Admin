const IMGBB_API_KEY = '29bfea99aa30ac4112ec43eac8554d9c';

export async function uploadImage(file: File): Promise<string> {
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
  return json.data.url as string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
