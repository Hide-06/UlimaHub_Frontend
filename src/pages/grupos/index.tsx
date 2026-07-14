import {
  Badge,
  Button,
  Card,
  Grid,
  Text,
  Title,
  Group,
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Select,
} from '@mantine/core';
import { Users, BookOpen, MessageCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Grupos.module.css';
import {
  cargarGrupos,
  unirseAGrupo,
  crearGrupo,
  eliminarGrupo,
} from '../../data/grupos';
import type { Grupo } from '../../data/grupos';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

const GruposPage = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [maximo, setMaximo] = useState<number | ''>('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(
    null
  );

  useEffect(() => {
    cargarGrupos().then(setGrupos);
    cargarCursos().then(setCursos);
  }, []);

  async function manejarUnirse(id: number) {
    setGrupos(
      grupos.map((g) =>
        g.id === id ? { ...g, unido: true, miembros: g.miembros + 1 } : g
      )
    );
    await unirseAGrupo(id);
  }

  async function manejarEliminarGrupo(id: number) {
    if (!window.confirm('¿Seguro que deseas eliminar este grupo?')) return;
    setGrupos(grupos.filter((g) => g.id !== id));
    await eliminarGrupo(id);
  }

  function irAlChat(grupo: Grupo) {
    sessionStorage.setItem('grupoActivo', JSON.stringify(grupo));
    navigate('/chat');
  }

  async function manejarCrearGrupo() {
    const curso = cursos.find((c) => c.nombre === cursoSeleccionado);
    if (!nombre.trim() || !maximo || !curso) return;

    await crearGrupo({
      nombre: nombre.trim(),
      maximo: Number(maximo),
      cursoId: curso.id,
    });

    setGrupos(await cargarGrupos());
    setNombre('');
    setMaximo('');
    setCursoSeleccionado(null);
    setModalAbierto(false);
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <Title order={2}>Grupos de Estudio</Title>
        <Button onClick={() => setModalAbierto(true)}>Crear grupo</Button>
      </div>

      {grupos.length === 0 && (
        <Text c="dimmed" size="sm">
          Todavía no hay grupos de estudio.
        </Text>
      )}

      <Grid>
        {grupos.map((grupo) => (
          <Grid.Col key={grupo.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              className={styles.tarjeta}
            >
              <Group justify="space-between">
                <Text fw={700} size="md">
                  {grupo.nombre}
                </Text>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  px={4}
                  onClick={() => manejarEliminarGrupo(grupo.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </Group>

              <Group gap="xs">
                <BookOpen size={14} />
                <Text size="sm" c="dimmed">
                  {grupo.curso}
                </Text>
              </Group>

              <div className={styles.miembros}>
                <Users size={14} />
                <Text size="sm">
                  {grupo.miembros} / {grupo.maximo} miembros
                </Text>
                {grupo.miembros === grupo.maximo && (
                  <Badge color="red" size="sm">
                    Lleno
                  </Badge>
                )}
              </div>

              <div className={styles.tarjetaFooter}>
                {grupo.unido ? (
                  <>
                    <Badge color="green" size="sm" mt={4}>
                      Unido ✓
                    </Badge>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<MessageCircle size={14} />}
                      fullWidth
                      onClick={() => irAlChat(grupo)}
                    >
                      Ir al chat
                    </Button>
                  </>
                ) : (
                  <Button
                    size="xs"
                    fullWidth
                    disabled={grupo.miembros === grupo.maximo}
                    onClick={() => manejarUnirse(grupo.id)}
                  >
                    {grupo.miembros === grupo.maximo ? 'Grupo lleno' : 'Unirse'}
                  </Button>
                )}
              </div>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nuevo grupo"
      >
        <Stack gap="sm">
          <TextInput
            label="Nombre del grupo"
            placeholder="Ej: Estudio Parcial"
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
          />
          <Select
            label="Curso"
            placeholder="Selecciona un curso"
            data={cursos.map((c) => ({ value: c.nombre, label: c.nombre }))}
            value={cursoSeleccionado}
            onChange={setCursoSeleccionado}
          />
          <NumberInput
            label="Máximo de miembros"
            value={maximo}
            onChange={(v) => setMaximo(typeof v === 'number' ? v : '')}
          />
          <Button
            fullWidth
            onClick={manejarCrearGrupo}
            disabled={!nombre.trim() || !maximo || !cursoSeleccionado}
          >
            Crear
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default GruposPage;
