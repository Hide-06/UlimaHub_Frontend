import { cargarCursos } from './cursos';

export interface Archivo {
  id: number;
  nombre: string;
  curso: string;
  fecha: string;
  tipo: string;
}

interface ArchivoApi {
  id: number;
  nombre: string;
  tipo: string;
  createdAt: string;
  CursoId: number;
}

const API_URL = 'http://localhost:3000/api/archivos';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarArchivos(): Promise<Archivo[]> {
  const [res, cursos] = await Promise.all([fetch(API_URL), cargarCursos()]);
  const archivos: ArchivoApi[] = await res.json();

  return archivos.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    tipo: a.tipo,
    fecha: a.createdAt.slice(0, 10),
    curso: cursos.find((c) => c.id === a.CursoId)?.nombre ?? '',
  }));
}

export async function subirArchivo(datos: {
  nombre: string;
  curso: string;
  tipo: string;
}) {
  const usuario = usuarioActual();
  const cursos = await cargarCursos();
  const curso = cursos.find((c) => c.nombre === datos.curso);

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: datos.nombre,
      tipo: datos.tipo,
      curso_id: curso?.id,
      usuario_id: usuario.id,
    }),
  });
}
