export interface Curso {
  id: number;
  nombre: string;
  profe: string;
  creditos: number;
  horario: string;
  ciclo: number;
}

const API_URL = 'http://localhost:3000/api/cursos';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarCursos(): Promise<Curso[]> {
  const usuario = usuarioActual();
  const res = await fetch(`${API_URL}?usuario_id=${usuario.id}`);
  return res.json();
}

export async function crearCurso(datos: {
  nombre: string;
  profe: string;
  horario: string;
  creditos: number;
  ciclo: number;
}) {
  const usuario = usuarioActual();
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, usuario_id: usuario.id }),
  });
}

export async function editarCurso(
  id: number,
  datos: {
    nombre: string;
    profe: string;
    horario: string;
    creditos: number;
    ciclo: number;
  }
) {
  await fetch(`${API_URL}/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}

export async function eliminarCurso(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
