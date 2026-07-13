import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import {
  cargarTareas,
  crearTarea,
  cambiarEstadoTarea,
  eliminarTarea as eliminarTareaApi,
} from '../../data/tareas';
import type { EstadoTarea, Tarea } from '../../data/tareas';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

function colorPorEstado(estado: EstadoTarea) {
  const colores = { pendiente: 'yellow', entregado: 'green', atrasado: 'red' };
  return colores[estado];
}

const ETIQUETAS_FILTRO: Record<EstadoTarea | 'todos', string> = {
  todos: 'Todas',
  pendiente: 'Pendientes',
  atrasado: 'Atrasados',
  entregado: 'Entregadas',
};

const TasksPage = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtroActivo, setFiltroActivo] = useState<EstadoTarea | 'todos'>(
    'todos'
  );
  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoCurso, setNuevoCurso] = useState<string | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState<Date | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      cargarTareas().then(setTareas),
      cargarCursos().then(setCursos),
    ])
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  const tareasFiltradas =
    filtroActivo === 'todos'
      ? tareas
      : tareas.filter((t) => t.estado === filtroActivo);

  async function cambiarEstado(id: number, estado: EstadoTarea) {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, estado } : t)));
    await cambiarEstadoTarea(id, estado);
  }

  async function eliminarTarea(id: number) {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    setTareas(tareas.filter((t) => t.id !== id));
    await eliminarTareaApi(id);
  }

  async function agregarTarea() {
    if (!nuevoTitulo.trim() || !nuevoCurso || !nuevaFecha) return;
    await crearTarea({
      titulo: nuevoTitulo.trim(),
      curso: nuevoCurso,
      fecha: dayjs(nuevaFecha).format('YYYY-MM-DD'),
    });
    setTareas(await cargarTareas());
    setNuevoTitulo('');
    setNuevoCurso(null);
    setNuevaFecha(null);
    setModalAbierto(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Group justify="space-between" mb="md">
        <Title order={2}>Mis Tareas</Title>
        <Button size="sm" onClick={() => setModalAbierto(true)}>
          + Nueva tarea
        </Button>
      </Group>

      {cargando && (
        <Text c="dimmed" mb="md">
          Cargando tareas...
        </Text>
      )}

      {error && (
        <Text c="red" mb="md">
          {error}
        </Text>
      )}

      <Group mb="lg">
        {(['todos', 'pendiente', 'atrasado', 'entregado'] as const).map((f) => (
          <Button
            key={f}
            size="xs"
            variant={filtroActivo === f ? 'filled' : 'outline'}
            color={
              f === 'pendiente'
                ? 'yellow'
                : f === 'atrasado'
                  ? 'red'
                  : f === 'entregado'
                    ? 'green'
                    : undefined
            }
            onClick={() => setFiltroActivo(f)}
          >
            {ETIQUETAS_FILTRO[f]}
          </Button>
        ))}
      </Group>

      <Stack gap="sm">
        {tareasFiltradas.map((tarea) => (
          <Card key={tarea.id} shadow="xs" padding="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text fw={600}>{tarea.titulo}</Text>
                <Text size="xs" c="dimmed">
                  {tarea.curso} · vence {tarea.fecha}
                </Text>
              </div>
              <Group gap="xs">
                <Select
                  size="xs"
                  value={tarea.estado}
                  onChange={(val) =>
                    val && cambiarEstado(tarea.id, val as EstadoTarea)
                  }
                  data={[
                    { value: 'pendiente', label: 'Pendiente' },
                    { value: 'entregado', label: 'Entregado' },
                    { value: 'atrasado', label: 'Atrasado' },
                  ]}
                  styles={{ input: { color: 'inherit' } }}
                  w={130}
                />
                <Badge color={colorPorEstado(tarea.estado)}>
                  {tarea.estado}
                </Badge>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  px={6}
                  onClick={() => eliminarTarea(tarea.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </Group>
            </Group>
          </Card>
        ))}

        {tareasFiltradas.length === 0 && (
          <Text c="dimmed" ta="center" mt="xl">
            No hay tareas en esta categoria
          </Text>
        )}
      </Stack>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nueva tarea"
      >
        <Stack gap="sm">
          <TextInput
            label="Titulo"
            placeholder="Ej: Entrega final"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.currentTarget.value)}
          />
          <Select
            label="Curso"
            placeholder="Selecciona un curso"
            data={cursos.map((c) => ({ value: c.nombre, label: c.nombre }))}
            value={nuevoCurso}
            onChange={setNuevoCurso}
          />
          <DateInput
            label="Fecha de entrega"
            placeholder="Selecciona una fecha"
            value={nuevaFecha}
            onChange={(value) => setNuevaFecha(value as Date | null)}
            valueFormat="DD/MM/YYYY"
          />
          <Button
            fullWidth
            onClick={agregarTarea}
            disabled={!nuevoTitulo.trim() || !nuevoCurso || !nuevaFecha}
          >
            Agregar
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default TasksPage;
