const API_URL = 'http://localhost:3000/api/usuarios';

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
