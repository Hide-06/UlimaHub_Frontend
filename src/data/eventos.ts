export interface Evento {
  id: number;
  fecha: string;
  titulo: string;
  tipo: 'tarea' | 'examen';
}

const API_URL = 'http://localhost:3000/api/eventos';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarEventos(): Promise<Evento[]> {
  const usuario = usuarioActual();
  const res = await fetch(`${API_URL}?usuario_id=${usuario.id}`);
  return res.json();
}

export async function crearEvento(evento: {
  fecha: string;
  titulo: string;
  tipo: string;
}) {
  const usuario = usuarioActual();
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...evento, usuario_id: usuario.id }),
  });
}

export async function eliminarEvento(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
