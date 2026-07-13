import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Stack,
  Title,
  TextInput,
  Card,
  Text,
  Grid,
  Badge,
  Group,
  ActionIcon,
  Divider,
} from '@mantine/core';
import {
  Search,
  FileText,
  Notebook,
  CheckSquare,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';
import { cargarNotas } from '../../data/notas';
import type { Nota } from '../../data/notas';
import { cargarArchivos } from '../../data/archivos';
import type { Archivo } from '../../data/archivos';
import { cargarTareas } from '../../data/tareas';
import type { Tarea } from '../../data/tareas';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

export const IntelligentSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [notas, setNotas] = useState<Nota[]>([]);
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      cargarNotas().then(setNotas),
      cargarArchivos().then(setArchivos),
      cargarTareas().then(setTareas),
      cargarCursos().then(setCursos),
    ])
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const apuntesFiltrados = notas.filter((item) =>
    item.title.toLowerCase().includes(query)
  );
  const archivosFiltrados = archivos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(query) ||
      item.curso.toLowerCase().includes(query)
  );
  const cursosFiltrados = cursos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(query) ||
      item.profe.toLowerCase().includes(query)
  );
  const tareasFiltradas = tareas.filter(
    (item) =>
      item.titulo.toLowerCase().includes(query) ||
      item.curso.toLowerCase().includes(query)
  );

  const totalResultados =
    apuntesFiltrados.length +
    archivosFiltrados.length +
    cursosFiltrados.length +
    tareasFiltradas.length;

  return (
    <Stack p="xl" style={{ gap: '24px' }}>
      <div>
        <Title order={1} mb="xs">
          Búsqueda Global
        </Title>
        <Text size="sm" c="dimmed">
          Encuentra e ingresa instantáneamente a tus recursos académicos.
        </Text>
      </div>

      {cargando && (
        <Text size="sm" c="dimmed">
          Cargando resultados...
        </Text>
      )}

      {error && (
        <Text size="sm" c="red">
          {error}
        </Text>
      )}

      <TextInput
        placeholder="Escribe algo para buscar en archivos, apuntes, cursos o tareas..."
        size="lg"
        leftSection={<Search size={18} color="gray" />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        styles={{
          input: {
            borderRadius: '12px',
          },
        }}
      />

      {searchQuery && (
        <Text size="sm" c="dimmed">
          Se encontraron {totalResultados} resultados para "{searchQuery}"
        </Text>
      )}

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" style={{ height: '100%' }}>
            <Group mb="xs">
              <Notebook size={18} color="#e8590c" />
              <Text fw={700}>Apuntes ({apuntesFiltrados.length})</Text>
            </Group>
            <Divider mb="sm" />
            <Stack style={{ gap: '10px' }}>
              {apuntesFiltrados.length > 0 ? (
                apuntesFiltrados.map((item) => (
                  <Card
                    key={item.id}
                    withBorder
                    p="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-default-hover)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/notes')}
                  >
                    <Group style={{ justifyContent: 'space-between' }}>
                      <div>
                        <Text fw="bold" size="sm">
                          {item.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Modificado: {item.date}
                        </Text>
                      </div>
                      <ActionIcon variant="subtle" color="orange">
                        <ArrowUpRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text size="xs" c="dimmed">
                  No hay coincidencias.
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" style={{ height: '100%' }}>
            <Group mb="xs">
              <FileText size={18} color="#228be6" />
              <Text fw={700}>Archivos ({archivosFiltrados.length})</Text>
            </Group>
            <Divider mb="sm" />
            <Stack style={{ gap: '10px' }}>
              {archivosFiltrados.length > 0 ? (
                archivosFiltrados.map((item) => (
                  <Card
                    key={item.id}
                    withBorder
                    p="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-default-hover)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/files')}
                  >
                    <Group style={{ justifyContent: 'space-between' }}>
                      <div>
                        <Text fw="bold" size="sm">
                          {item.nombre}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.curso}
                        </Text>
                      </div>
                      <ActionIcon variant="subtle" color="blue">
                        <ArrowUpRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text size="xs" c="dimmed">
                  No hay coincidencias.
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" style={{ height: '100%' }}>
            <Group mb="xs">
              <GraduationCap size={18} color="#12b886" />
              <Text fw={700}>Cursos ({cursosFiltrados.length})</Text>
            </Group>
            <Divider mb="sm" />
            <Stack style={{ gap: '10px' }}>
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((item) => (
                  <Card
                    key={item.id}
                    withBorder
                    p="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-default-hover)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/courses')}
                  >
                    <Group style={{ justifyContent: 'space-between' }}>
                      <div>
                        <Text fw="bold" size="sm">
                          {item.nombre}
                        </Text>
                        <Group gap="xs">
                          <Badge size="xs" color="teal">
                            Ciclo {item.ciclo}
                          </Badge>
                        </Group>
                      </div>
                      <ActionIcon variant="subtle" color="teal">
                        <ArrowUpRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text size="xs" c="dimmed">
                  No hay coincidencias.
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="md" style={{ height: '100%' }}>
            <Group mb="xs">
              <CheckSquare size={18} color="#fab005" />
              <Text fw={700}>Tareas ({tareasFiltradas.length})</Text>
            </Group>
            <Divider mb="sm" />
            <Stack style={{ gap: '10px' }}>
              {tareasFiltradas.length > 0 ? (
                tareasFiltradas.map((item) => (
                  <Card
                    key={item.id}
                    withBorder
                    p="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-default-hover)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/tasks')}
                  >
                    <Group style={{ justifyContent: 'space-between' }}>
                      <div>
                        <Text fw="bold" size="sm">
                          {item.titulo}
                        </Text>
                        <Text size="xs" c="red">
                          Vence: {item.fecha}
                        </Text>
                      </div>
                      <ActionIcon variant="subtle" color="yellow">
                        <ArrowUpRight size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text size="xs" c="dimmed">
                  No hay coincidencias.
                </Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default IntelligentSearchPage;
