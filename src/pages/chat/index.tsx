import {
  Card,
  Text,
  Title,
  TextInput,
  Button,
  ScrollArea,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import styles from './Chat.module.css';
import { cargarChats, cargarMensajes, enviarMensaje } from '../../data/chats';
import type { Chat, Mensaje } from '../../data/chats';

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatSeleccionado, setChatSeleccionado] = useState<Chat | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarChats().then((chats) => {
      setChats(chats);

      const grupoActivo = sessionStorage.getItem('grupoActivo')
        ? JSON.parse(sessionStorage.getItem('grupoActivo')!)
        : null;

      const chatInicial = grupoActivo
        ? chats.find((c) => c.nombre === grupoActivo.nombre) || chats[0]
        : chats[0];

      setChatSeleccionado(chatInicial ?? null);
    });
  }, []);

  useEffect(() => {
    if (chatSeleccionado) {
      cargarMensajes(chatSeleccionado.id).then(setMensajes);
    }
  }, [chatSeleccionado]);

  const manejarEnviarMensaje = async () => {
    if (!mensaje.trim() || !chatSeleccionado) return;
    await enviarMensaje(chatSeleccionado.id, mensaje);
    setMensajes(await cargarMensajes(chatSeleccionado.id));
    setMensaje('');
  };

  if (!chatSeleccionado) {
    return (
      <div style={{ padding: 20 }}>
        <Text c="dimmed">Todavia no hay chats.</Text>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      {/* sidebar de chats */}
      <Card withBorder radius="md" className={styles.sidebar} padding="md">
        <Title order={4} mb="md">
          Chats
        </Title>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${chat.id === chatSeleccionado.id ? styles.chatItemActivo : ''}`}
            onClick={() => setChatSeleccionado(chat)}
          >
            <Text fw={600} size="sm">
              {chat.nombre}
            </Text>
            <Text size="xs" c="dimmed">
              {chat.tipo === 'grupo' ? '👥 Grupo' : '👤 Personal'}
            </Text>
          </div>
        ))}
      </Card>

      {/* panel de mensajes */}
      <Card withBorder radius="md" className={styles.chatActivo} padding={0}>
        {/* header del chat */}
        <div
          style={{ padding: '12px 16px', borderBottom: '1px solid #373a40' }}
        >
          <Title order={4}>{chatSeleccionado.nombre}</Title>
          <Text size="xs" c="dimmed">
            {chatSeleccionado.tipo === 'grupo'
              ? 'Grupo de estudio'
              : 'Chat personal'}
          </Text>
        </div>

        {/* mensajes */}
        <ScrollArea className={styles.mensajes}>
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={msg.propio ? styles.mensajePropio : styles.mensajeOtro}
            >
              {!msg.propio && (
                <div className={styles.nombreMensaje}>{msg.autor}</div>
              )}
              <Text size="sm">{msg.texto}</Text>
              <Text size="xs" opacity={0.7} ta="right">
                {msg.hora}
              </Text>
            </div>
          ))}
        </ScrollArea>

        {/* input */}
        <div className={styles.inputArea}>
          <TextInput
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && manejarEnviarMensaje()}
            style={{ flex: 1 }}
          />
          <Button
            onClick={manejarEnviarMensaje}
            leftSection={<Send size={16} />}
          >
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
