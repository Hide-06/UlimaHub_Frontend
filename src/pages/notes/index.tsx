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
  Select,
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
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

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
        {notas.length === 0 && (
          <Text c="dimmed" size="sm" ta="center" mt="md">
            Todavía no tienes notas.
          </Text>
        )}
        {notas.map((nota) => (
          <Group key={nota.id} justify="space-between" align="center" pr={4}>
            <NavLink
              label={nota.title || 'Sin titulo'}
              description={
                nota.curso
                  ? `${nota.curso} · Editado: ${nota.date}`
                  : `Editado: ${nota.date}`
              }
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
  cursos: Curso[];
  onActualizarContenido: (id: number, contenido: string) => void;
  onActualizarTitulo: (id: number, titulo: string) => void;
  onActualizarCurso: (id: number, cursoNombre: string) => void;
}

const NotasContenido = ({
  notaActiva,
  cursos,
  onActualizarContenido,
  onActualizarTitulo,
  onActualizarCurso,
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
                  color: 'var(--mantine-color-text)',
                  padding: 0,
                  height: 'auto',
                },
              }}
            />
            <Select
              label="Curso"
              placeholder="Sin curso"
              data={cursos.map((c) => ({ value: c.nombre, label: c.nombre }))}
              value={notaActiva.curso || null}
              onChange={(valor) =>
                onActualizarCurso(notaActiva.id, valor || '')
              }
              clearable
              size="xs"
              style={{ maxWidth: 240 }}
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
              style={{
                flex: 1,
                backgroundColor: 'var(--mantine-color-body)',
                padding: '12px',
              }}
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
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoFiltro, setCursoFiltro] = useState(
    () => sessionStorage.getItem('cursoActivo') || 'Todos'
  );

  useEffect(() => {
    cargarNotas().then((notas) => {
      setNotas(notas);
      setNotaActivaId(notas[0]?.id ?? 0);
    });
    cargarCursos().then(setCursos);
  }, []);

  const notaActiva = notas.find((n) => n.id === notaActivaId);

  const notasFiltradas =
    cursoFiltro === 'Todos'
      ? notas
      : notas.filter((n) => n.curso === cursoFiltro);

  function idDeCurso(nombreCurso: string) {
    return cursos.find((c) => c.nombre === nombreCurso)?.id ?? null;
  }

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
      cursoId: idDeCurso(notaActiva?.curso ?? ''),
    });
  }

  async function actualizarTitulo(id: number, titulo: string) {
    setNotas(notas.map((n) => (n.id === id ? { ...n, title: titulo } : n)));
    await actualizarNota(id, {
      title: titulo,
      content: notaActiva?.content ?? '',
      cursoId: idDeCurso(notaActiva?.curso ?? ''),
    });
  }

  async function actualizarCursoNota(id: number, cursoNombre: string) {
    setNotas(
      notas.map((n) => (n.id === id ? { ...n, curso: cursoNombre } : n))
    );
    const nota = notas.find((n) => n.id === id);
    await actualizarNota(id, {
      title: nota?.title ?? '',
      content: nota?.content ?? '',
      cursoId: idDeCurso(cursoNombre),
    });
  }

  async function crearNota() {
    const curso = cursos.find((c) => c.nombre === cursoFiltro);
    const nueva = await crearNotaApi(curso?.id);
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
      <Select
        label="Filtrar por curso"
        data={['Todos', ...cursos.map((c) => c.nombre)]}
        value={cursoFiltro}
        onChange={(valor) => setCursoFiltro(valor || 'Todos')}
        mb="md"
        style={{ maxWidth: 300 }}
      />
      <Grid style={{ gap: '16px' }}>
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <NotasSidebar
            notas={notasFiltradas}
            notaActivaId={notaActivaId}
            onSeleccionar={setNotaActivaId}
            onCrear={crearNota}
            onEliminar={eliminarNota}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }} style={{ flex: 1 }}>
          <NotasContenido
            notaActiva={notaActiva}
            cursos={cursos}
            onActualizarContenido={actualizarContenido}
            onActualizarTitulo={actualizarTitulo}
            onActualizarCurso={actualizarCursoNota}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default NotesPage;
