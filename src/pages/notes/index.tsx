import { useState, useEffect } from 'react';
import {
  Grid,
  Stack,
  Title,
  Card,
  Text,
  Button,
  NavLink,
  ScrollArea,
  Divider,
  TextInput,
  Group,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '@mantine/tiptap/styles.css';
import {
  cargarNotas,
  crearNota as crearNotaApi,
  actualizarNota,
  eliminarNota as eliminarNotaApi,
} from '../../data/notas';
import type { Nota } from '../../data/notas';

interface SidebarProps {
  notas: Nota[];
  notaActivaId: number;
  onSeleccionar: (id: number) => void;
  onCrear: () => void;
  onEliminar: (id: number) => void;
}

const NotasSidebar = ({
  notas,
  notaActivaId,
  onSeleccionar,
  onCrear,
  onEliminar,
}: SidebarProps) => (
  <Card
    withBorder
    radius="md"
    p="md"
    h="70vh"
    style={{ display: 'flex', flexDirection: 'column' }}
  >
    <Button variant="filled" color="orange" fullWidth mb="md" onClick={onCrear}>
      + Nueva Nota
    </Button>
    <Divider mb="sm" />
    <ScrollArea style={{ flex: 1 }} type="hover">
      <Stack style={{ gap: '8px' }}>
        {notas.map((nota) => (
          <Group key={nota.id} justify="space-between" align="center" pr={4}>
            <NavLink
              label={nota.title || 'Sin titulo'}
              description={`Editado: ${nota.date}`}
              variant="filled"
              color="dark.4"
              active={nota.id === notaActivaId}
              onClick={() => onSeleccionar(nota.id)}
              styles={{ root: { borderRadius: '8px', flex: 1 } }}
            />
            <Button
              size="xs"
              variant="subtle"
              color="red"
              px={4}
              onClick={() => onEliminar(nota.id)}
            >
              ✕
            </Button>
          </Group>
        ))}
      </Stack>
    </ScrollArea>
  </Card>
);

interface ContenidoProps {
  notaActiva: Nota | undefined;
  onActualizarContenido: (id: number, contenido: string) => void;
  onActualizarTitulo: (id: number, titulo: string) => void;
}

const NotasContenido = ({
  notaActiva,
  onActualizarContenido,
  onActualizarTitulo,
}: ContenidoProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: notaActiva ? notaActiva.content : '',
    onUpdate({ editor }) {
      if (notaActiva) {
        onActualizarContenido(notaActiva.id, editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && notaActiva) {
      if (editor.getHTML() !== notaActiva.content) {
        editor.commands.setContent(notaActiva.content);
      }
    }
  }, [notaActiva?.id, editor]);

  return (
    <Card
      withBorder
      radius="md"
      p="xl"
      h="70vh"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {notaActiva ? (
        <>
          <Stack style={{ gap: '4px' }} mb="lg">
            <TextInput
              value={notaActiva.title}
              onChange={(e) =>
                onActualizarTitulo(notaActiva.id, e.currentTarget.value)
              }
              placeholder="Sin título"
              variant="unstyled"
              styles={{
                input: {
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'white',
                  padding: 0,
                  height: 'auto',
                },
              }}
            />
            <Text size="xs" c="dimmed">
              Última modificación: {notaActiva.date}
            </Text>
          </Stack>
          <Divider mb="xl" />
          <RichTextEditor
            editor={editor}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <RichTextEditor.Toolbar>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <ScrollArea
              style={{ flex: 1, backgroundColor: '#1A1B1E', padding: '12px' }}
            >
              <RichTextEditor.Content />
            </ScrollArea>
          </RichTextEditor>
        </>
      ) : (
        <Stack align="center" justify="center" style={{ flex: 1 }}>
          <Text c="dimmed">
            Selecciona o crea una nota para empezar a escribir.
          </Text>
        </Stack>
      )}
    </Card>
  );
};

export const NotesPage = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaActivaId, setNotaActivaId] = useState<number>(0);

  useEffect(() => {
    cargarNotas().then((notas) => {
      setNotas(notas);
      setNotaActivaId(notas[0]?.id ?? 0);
    });
  }, []);

  const notaActiva = notas.find((n) => n.id === notaActivaId);

  async function actualizarContenido(id: number, contenido: string) {
    const hoy = new Date().toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
    });
    setNotas(
      notas.map((n) =>
        n.id === id ? { ...n, content: contenido, date: hoy } : n
      )
    );
    await actualizarNota(id, {
      title: notaActiva?.title ?? '',
      content: contenido,
    });
  }

  async function actualizarTitulo(id: number, titulo: string) {
    setNotas(notas.map((n) => (n.id === id ? { ...n, title: titulo } : n)));
    await actualizarNota(id, {
      title: titulo,
      content: notaActiva?.content ?? '',
    });
  }

  async function crearNota() {
    const nueva = await crearNotaApi();
    setNotas([nueva, ...notas]);
    setNotaActivaId(nueva.id);
  }

  async function eliminarNota(id: number) {
    if (!window.confirm('¿Seguro que deseas eliminar esta nota?')) return;
    const actualizadas = notas.filter((n) => n.id !== id);
    setNotas(actualizadas);
    if (notaActivaId === id) {
      setNotaActivaId(actualizadas[0]?.id ?? 0);
    }
    await eliminarNotaApi(id);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="md">
        Apuntes
      </Title>
      <Grid style={{ gap: '16px' }}>
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <NotasSidebar
            notas={notas}
            notaActivaId={notaActivaId}
            onSeleccionar={setNotaActivaId}
            onCrear={crearNota}
            onEliminar={eliminarNota}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }} style={{ flex: 1 }}>
          <NotasContenido
            notaActiva={notaActiva}
            onActualizarContenido={actualizarContenido}
            onActualizarTitulo={actualizarTitulo}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default NotesPage;
