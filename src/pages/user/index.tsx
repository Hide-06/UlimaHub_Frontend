import {
  Card,
  Text,
  Title,
  Button,
  Badge,
  Grid,
  Divider,
  TextInput,
  Select,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Mail, BookOpen, GraduationCap, Pencil } from 'lucide-react';
import styles from './User.module.css';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';
import { actualizarUsuario } from '../../data/usuario';

const UserPage = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [usuario, setUsuario] = useState(() =>
    JSON.parse(localStorage.getItem('usuario') || '{}')
  );
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [ciclo, setCiclo] = useState<string | null>(null);
  const [carrera, setCarrera] = useState('');

  useEffect(() => {
    cargarCursos().then(setCursos);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  function abrirEditar() {
    setNombre(usuario.nombre || '');
    setCiclo(usuario.ciclo || null);
    setCarrera(usuario.carrera || '');
    setEditando(true);
  }

  async function manejarGuardar() {
    if (!nombre.trim() || !ciclo) return;
    const actualizado = await actualizarUsuario(usuario.id, {
      nombre: nombre.trim(),
      ciclo,
      carrera: carrera.trim(),
    });
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    setUsuario(actualizado);
    setEditando(false);
  }

  // saca las iniciales del nombre
  const iniciales = usuario.nombre
    ? usuario.nombre
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className={styles.contenedor}>
      <Title order={2} mb="xl">
        Mi Perfil
      </Title>

      {/* encabezado con avatar */}
      <Card withBorder radius="md" padding="xl" mb="lg">
        <div className={styles.encabezado}>
          <div className={styles.avatar}>{iniciales}</div>
          <div className={styles.info}>
            {editando ? (
              <>
                <TextInput
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.currentTarget.value)}
                />
                <TextInput
                  label="Carrera"
                  value={carrera}
                  onChange={(e) => setCarrera(e.currentTarget.value)}
                />
                <Select
                  label="Ciclo"
                  data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                  value={ciclo}
                  onChange={setCiclo}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button size="xs" onClick={manejarGuardar}>
                    Guardar
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Title order={3}>{usuario.nombre || 'Usuario'}</Title>
                  <Button
                    size="xs"
                    variant="subtle"
                    px={4}
                    onClick={abrirEditar}
                  >
                    <Pencil size={14} />
                  </Button>
                </div>
                <Text
                  c="dimmed"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Mail size={14} /> {usuario.email || 'sin correo'}
                </Text>

                <Text
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <GraduationCap size={14} /> {usuario.carrera || 'Sin carrera'}
                </Text>

                <Text
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <BookOpen size={14} /> Ciclo {usuario.ciclo || '6'}
                </Text>
              </>
            )}
          </div>
        </div>

        <Divider mb="md" />

        <Button
          color="red"
          variant="light"
          leftSection={<LogOut size={16} />}
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </Button>
      </Card>

      {/* cursos matriculados */}
      <div className={styles.seccion}>
        <Title order={4} mb="md">
          Cursos matriculados
        </Title>
        <Grid>
          {cursos.map((curso) => (
            <Grid.Col key={curso.id} span={{ base: 12, sm: 6 }}>
              <Card withBorder radius="md" padding="md">
                <Text fw={600} size="sm">
                  {curso.nombre}
                </Text>
                <Text size="xs" c="dimmed">
                  {curso.creditos} créditos · {curso.profe}
                </Text>
                <Badge color="green" size="sm" mt={6}>
                  Ciclo {curso.ciclo}
                </Badge>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default UserPage;
