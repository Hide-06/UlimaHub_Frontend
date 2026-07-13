export interface Nota {
  id: number;
  title: string;
  content: string;
  date: string;
  curso: string;
}

interface NotaApi {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  Curso: { nombre: string } | null;
}

const API_URL = 'http://localhost:3000/api/notas';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

function formatFecha(fechaIso: string) {
  return new Date(fechaIso).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
  });
}

export async function cargarNotas(): Promise<Nota[]> {
  const usuario = usuarioActual();
  const res = await fetch(`${API_URL}?usuario_id=${usuario.id}`);
  const notas: NotaApi[] = await res.json();

  return notas.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    date: formatFecha(n.updatedAt),
    curso: n.Curso?.nombre ?? '',
  }));
}

export async function crearNota(cursoId?: number) {
  const usuario = usuarioActual();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Nueva Nota',
      content: '',
      usuario_id: usuario.id,
      curso_id: cursoId,
    }),
  });
  const nota = await res.json();
  return {
    id: nota.id,
    title: nota.title,
    content: nota.content,
    date: 'Hoy',
    curso: nota.Curso?.nombre ?? '',
  };
}

export async function actualizarNota(
  id: number,
  datos: { title: string; content: string; cursoId: number | null }
) {
  await fetch(`${API_URL}/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: datos.title,
      content: datos.content,
      curso_id: datos.cursoId,
    }),
  });
}
export async function eliminarNota(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
