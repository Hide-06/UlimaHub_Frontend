const API_URL = `${import.meta.env.VITE_API_URL}/api/usuarios`;

export async function actualizarUsuario(
  id: number,
  datos: { nombre: string; ciclo: string; carrera: string }
) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return res.json();
}
