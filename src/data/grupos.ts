export interface Grupo {
  id: number;
  nombre: string;
  curso: string;
  miembros: number;
  maximo: number;
  unido: boolean;
}

interface GrupoApi {
  id: number;
  nombre: string;
  miembros: number;
  maximo: number;
  unido: boolean;
  CursoId: number;
  Curso: { nombre: string } | null;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api/grupos`;

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarGrupos(): Promise<Grupo[]> {
  const usuario = usuarioActual();
  const res = await fetch(`${API_URL}?usuario_id=${usuario.id}`);
  const grupos: GrupoApi[] = await res.json();

  return grupos.map((g) => ({
    id: g.id,
    nombre: g.nombre,
    miembros: g.miembros,
    maximo: g.maximo,
    unido: g.unido,
    curso: g.Curso?.nombre ?? '',
  }));
}

export async function unirseAGrupo(id: number) {
  const usuario = usuarioActual();
  await fetch(`${API_URL}/${id}/unirse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id: usuario.id }),
  });
}

export async function crearGrupo(datos: {
  nombre: string;
  maximo: number;
  cursoId: number;
}) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: datos.nombre,
      maximo: datos.maximo,
      curso_id: datos.cursoId,
    }),
  });
}

export async function eliminarGrupo(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
