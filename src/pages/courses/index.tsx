import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { FileText, Notebook, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  cargarCursos,
  crearCurso,
  editarCurso,
  eliminarCurso,
} from '../../data/cursos';
import type { Curso } from '../../data/cursos';

const CoursesPage = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);

  const [nombre, setNombre] = useState('');
  const [profe, setProfe] = useState('');
  const [horario, setHorario] = useState('');
  const [creditos, setCreditos] = useState<number | ''>('');
  const [ciclo, setCiclo] = useState<number | ''>('');

  const navigate = useNavigate();

  useEffect(() => {
    cargarCursos().then(setCursos);
  }, []);

  function abrirNuevo() {
    setCursoEditando(null);
    setNombre('');
    setProfe('');
    setHorario('');
    setCreditos('');
    setCiclo('');
    setModalAbierto(true);
  }

  function abrirEditar(curso: Curso) {
    setCursoEditando(curso);
    setNombre(curso.nombre);
    setProfe(curso.profe);
    setHorario(curso.horario);
    setCreditos(curso.creditos);
    setCiclo(curso.ciclo);
    setModalAbierto(true);
  }

  async function manejarGuardar() {
    if (
      !nombre.trim() ||
      !profe.trim() ||
      !horario.trim() ||
      !creditos ||
      !ciclo
    )
      return;

    const datos = {
      nombre: nombre.trim(),
      profe: profe.trim(),
      horario: horario.trim(),
      creditos: Number(creditos),
      ciclo: Number(ciclo),
    };

    if (cursoEditando) {
      await editarCurso(cursoEditando.id, datos);
    } else {
      await crearCurso(datos);
    }

    setCursos(await cargarCursos());
    setModalAbierto(false);
  }

  async function manejarEliminar(id: number) {
    if (!window.confirm('¿Seguro que deseas eliminar este curso?')) return;
    setCursos(cursos.filter((c) => c.id !== id));
    await eliminarCurso(id);
  }

  function irAArchivos(curso: Curso) {
    sessionStorage.setItem('cursoActivo', curso.nombre);
    navigate('/files');
  }

  function irAApuntes(curso: Curso) {
    sessionStorage.setItem('cursoActivo', curso.nombre);
    navigate('/notes');
  }

  return (
    <div style={{ padding: '20px' }}>
      <Group justify="space-between" mb="md">
        <Title order={2}>Mis Cursos</Title>
        <Button onClick={abrirNuevo}>+ Nuevo curso</Button>
      </Group>

      {cursos.length === 0 && (
        <Text c="dimmed" size="sm">
          Todavía no agregaste ningún curso.
        </Text>
      )}

      <Grid>
        {cursos.map((curso) => (
          <Grid.Col key={curso.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              h="100%"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Stack gap="xs" style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text fw={700} size="lg">
                    {curso.nombre}
                  </Text>
                  <Group gap={4}>
                    <Button
                      size="xs"
                      variant="subtle"
                      px={4}
                      onClick={() => abrirEditar(curso)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      px={4}
                      onClick={() => manejarEliminar(curso.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed">
                  {curso.profe}
                </Text>
                <Text size="sm">{curso.horario}</Text>
                <Group gap="xs" mt="auto">
                  <Badge variant="light" color="brand" size="sm">
                    {curso.creditos} créditos
                  </Badge>
                  <Badge variant="light" color="neutral" size="sm">
                    Ciclo {curso.ciclo}
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<Notebook size={14} />}
                    style={{ flex: 1 }}
                    onClick={() => irAApuntes(curso)}
                  >
                    Apuntes
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<FileText size={14} />}
                    style={{ flex: 1 }}
                    onClick={() => irAArchivos(curso)}
                  >
                    Archivos
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={cursoEditando ? 'Editar curso' : 'Nuevo curso'}
      >
        <Stack gap="sm">
          <TextInput
            label="Nombre del curso"
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
          />
          <TextInput
            label="Profesor"
            value={profe}
            onChange={(e) => setProfe(e.currentTarget.value)}
          />
          <TextInput
            label="Horario"
            placeholder="Ej: Lun / Mie 10:00am"
            value={horario}
            onChange={(e) => setHorario(e.currentTarget.value)}
          />
          <NumberInput
            label="Créditos"
            value={creditos}
            onChange={(v) => setCreditos(typeof v === 'number' ? v : '')}
          />
          <NumberInput
            label="Ciclo"
            value={ciclo}
            onChange={(v) => setCiclo(typeof v === 'number' ? v : '')}
          />
          <Button
            fullWidth
            onClick={manejarGuardar}
            disabled={
              !nombre.trim() ||
              !profe.trim() ||
              !horario.trim() ||
              !creditos ||
              !ciclo
            }
          >
            Guardar
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default CoursesPage;
