export interface Mensaje {
  id: number;
  autor: string;
  texto: string;
  hora: string;
  propio: boolean;
}

export interface Chat {
  id: number;
  nombre: string;
  tipo: 'grupo' | 'personal';
}

interface MensajeApi {
  id: number;
  texto: string;
  AutorId: number;
  createdAt: string;
  Autor?: { nombre: string };
}

const API_URL = 'http://localhost:3000/api/chats';

function usuarioActual() {
  return JSON.parse(localStorage.getItem('usuario')!);
}

export async function cargarChats(): Promise<Chat[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function cargarMensajes(chatId: number): Promise<Mensaje[]> {
  const usuario = usuarioActual();
  const res = await fetch(`${API_URL}/${chatId}/mensajes`);
  const mensajes: MensajeApi[] = await res.json();

  return mensajes.map((m) => ({
    id: m.id,
    texto: m.texto,
    autor: m.Autor?.nombre ?? 'Usuario',
    propio: m.AutorId === usuario.id,
    hora: new Date(m.createdAt).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export async function enviarMensaje(chatId: number, texto: string) {
  const usuario = usuarioActual();
  await fetch(`${API_URL}/${chatId}/mensajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto, usuario_id: usuario.id }),
  });
}
