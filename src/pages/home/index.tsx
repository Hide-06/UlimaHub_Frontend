import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  CalendarDays,
  FileText,
  MessageCircle,
  Notebook,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';
import { cargarTareas } from '../../data/tareas';
import type { Tarea } from '../../data/tareas';
import { cargarEventos } from '../../data/eventos';
import type { Evento } from '../../data/eventos';
import { cargarGrupos } from '../../data/grupos';
import type { Grupo } from '../../data/grupos';

function getColorEstado(estado: string) {
  if (estado === 'pendiente') return 'yellow';
  if (estado === 'atrasado') return 'red';
  return 'green';
}

function colorTipo(tipo: string) {
  return tipo === 'examen' ? 'red' : 'brand';
}

const accesosRapidos = [
  { label: 'Archivos', ruta: '/files', icono: <FileText size={20} /> },
  { label: 'Apuntes', ruta: '/notes', icono: <Notebook size={20} /> },
  { label: 'Calendario', ruta: '/calendar', icono: <CalendarDays size={20} /> },
  { label: 'Chat', ruta: '/chat', icono: <MessageCircle size={20} /> },
];

const DashBoardPage = () => {
  const navigate = useNavigate();
  // estado del buscador de tareas
  const [busqueda, setBusqueda] = useState('');

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [todasLasTareas, setTodasLasTareas] = useState<Tarea[]>([]);
  const [eventosCalendario, setEventosCalendario] = useState<Evento[]>([]);
  const [misGrupos, setMisGrupos] = useState<Grupo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      cargarCursos().then(setCursos),
      cargarTareas().then(setTodasLasTareas),
      cargarEventos().then(setEventosCalendario),
      cargarGrupos().then((grupos) =>
        setMisGrupos(grupos.filter((g) => g.unido))
      ),
    ])
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  const proximosCuatro = eventosCalendario
    .filter((e) => !dayjs(e.fecha).isBefore(dayjs(), 'day'))
    .sort((a, b) => dayjs(a.fecha).diff(dayjs(b.fecha)))
    .slice(0, 4);

  const tareasFiltradas = todasLasTareas.filter(
    (t) =>
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.curso.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="md">
        Dashboard
      </Title>

      {cargando && (
        <Text c="dimmed" mb="md">
          Cargando tu dashboard...
        </Text>
      )}

      {error && (
        <Text c="red" mb="md">
          {error}
        </Text>
      )}

      {/* buscador rapido arriba de todo */}
      <TextInput
        placeholder="Buscar tareas o cursos..."
        leftSection={<Search size={16} />}
        value={busqueda}
        onChange={(e) => setBusqueda(e.currentTarget.value)}
        mb="xl"
        style={{ maxWidth: 400 }}
      />

      {/* accesos rapidos a las secciones */}
      <Group mb="xl" gap="sm">
        {accesosRapidos.map((acc) => (
          <Button
            key={acc.ruta}
            variant="light"
            leftSection={acc.icono}
            size="sm"
            onClick={() => navigate(acc.ruta)}
          >
            {acc.label}
          </Button>
        ))}
      </Group>

      {/* stats rapidos */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={700} size="xl">
              {cursos.length}
            </Text>
            <Text c="dimmed" size="sm">
              Cursos activos
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={700} size="xl">
              {todasLasTareas.filter((t) => t.estado === 'pendiente').length}
            </Text>
            <Text c="dimmed" size="sm">
              Tareas pendientes
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={700} size="xl" c="red">
              {todasLasTareas.filter((t) => t.estado === 'atrasado').length}
            </Text>
            <Text c="dimmed" size="sm">
              Atrasadas
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* proximas entregas con filtro */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Title order={4} mb="sm">
            Proximas entregas
          </Title>
          <Grid>
            {tareasFiltradas.map((tarea) => (
              <Grid.Col key={tarea.id} span={{ base: 12, sm: 6 }}>
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Group justify="space-between" mb={4}>
                    <Text fw={600} size="sm">
                      {tarea.titulo}
                    </Text>
                    <Badge color={getColorEstado(tarea.estado)} size="sm">
                      {tarea.estado}
                    </Badge>
                  </Group>
                  <Text c="dimmed" size="xs">
                    {tarea.curso}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
            {tareasFiltradas.length === 0 && (
              <Grid.Col span={12}>
                <Text c="dimmed" size="sm">
                  No tienes entregas pendientes o proximas
                </Text>
              </Grid.Col>
            )}
          </Grid>
        </Grid.Col>

        {/* feed de proximos eventos del calendario */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title order={4} mb="sm">
            Proximos eventos
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              {proximosCuatro.map((ev) => (
                <Card
                  key={ev.id}
                  shadow="xs"
                  padding="sm"
                  radius="sm"
                  withBorder
                >
                  <Group justify="space-between">
                    <div>
                      <Badge
                        color={colorTipo(ev.tipo)}
                        size="xs"
                        variant="light"
                        mb={4}
                      >
                        {ev.tipo}
                      </Badge>
                      <Text size="sm" fw={500}>
                        {ev.titulo}
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                      {dayjs(ev.fecha).format('D MMM')}
                    </Text>
                  </Group>
                </Card>
              ))}
              {proximosCuatro.length === 0 && (
                <Text c="dimmed" size="sm">
                  No tienes eventos proximos
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* mis grupos activos */}
      <Title order={4} mt="xl" mb="sm">
        Mis grupos
      </Title>
      <Grid>
        {misGrupos.map((grupo) => (
          <Grid.Col key={grupo.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="xs" padding="md" radius="md" withBorder>
              <Text fw={600} size="sm" mb={4}>
                {grupo.nombre}
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                {grupo.curso} · {grupo.miembros} miembros
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<MessageCircle size={14} />}
                fullWidth
                onClick={() => {
                  // guarda el grupo en session para que el chat lo cargue
                  sessionStorage.setItem('grupoActivo', JSON.stringify(grupo));
                  navigate('/chat');
                }}
              >
                Ir al chat
              </Button>
            </Card>
          </Grid.Col>
        ))}
        {misGrupos.length === 0 && (
          <Grid.Col span={12}>
            <Text c="dimmed" size="sm">
              No perteneces a ningun grupo todavia
            </Text>
          </Grid.Col>
        )}
      </Grid>
    </div>
  );
};

export default DashBoardPage;
