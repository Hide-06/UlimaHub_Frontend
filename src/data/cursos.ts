export interface Curso {
  id: number;
  nombre: string;
  profe: string;
  creditos: number;
  horario: string;
  ciclo: number;
}

const API_URL = 'http://localhost:3000/api/cursos';

export async function cargarCursos(): Promise<Curso[]> {
  const res = await fetch(API_URL);
  return res.json();
}
