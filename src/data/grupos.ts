import { cargarCursos } from './cursos';

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
}

const API_URL = 'http://localhost:3000/api/grupos';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarGrupos(): Promise<Grupo[]> {
  const usuario = usuarioActual();
  const [res, cursos] = await Promise.all([
    fetch(`${API_URL}?usuario_id=${usuario.id}`),
    cargarCursos(),
  ]);
  const grupos: GrupoApi[] = await res.json();

  return grupos.map((g) => ({
    id: g.id,
    nombre: g.nombre,
    miembros: g.miembros,
    maximo: g.maximo,
    unido: g.unido,
    curso: cursos.find((c) => c.id === g.CursoId)?.nombre ?? '',
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
