import { cargarCursos } from './cursos';

export type EstadoTarea = 'pendiente' | 'entregado' | 'atrasado';

export interface Tarea {
  id: number;
  titulo: string;
  curso: string;
  fecha: string;
  estado: EstadoTarea;
}

interface TareaApi {
  id: number;
  titulo: string;
  fecha: string;
  estado: EstadoTarea;
  CursoId: number;
}

const API_URL = 'http://localhost:3000/api/tareas';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarTareas(): Promise<Tarea[]> {
  const usuario = usuarioActual();
  const [res, cursos] = await Promise.all([
    fetch(`${API_URL}?usuario_id=${usuario.id}`),
    cargarCursos(),
  ]);
  const tareas: TareaApi[] = await res.json();

  return tareas.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    fecha: t.fecha,
    estado: t.estado,
    curso: cursos.find((c) => c.id === t.CursoId)?.nombre ?? '',
  }));
}

export async function crearTarea(datos: {
  titulo: string;
  curso: string;
  fecha: string;
}) {
  const usuario = usuarioActual();
  const cursos = await cargarCursos();
  const curso = cursos.find((c) => c.nombre === datos.curso);

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: datos.titulo,
      fecha: datos.fecha,
      curso_id: curso?.id,
      usuario_id: usuario.id,
    }),
  });
}

export async function cambiarEstadoTarea(id: number, estado: EstadoTarea) {
  await fetch(`${API_URL}/${id}/estado`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
}

export async function eliminarTarea(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
