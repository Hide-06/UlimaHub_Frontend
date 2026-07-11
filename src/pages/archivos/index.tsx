import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { FileText, FileSpreadsheet, File } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './Archivos.module.css';
import { cargarArchivos, subirArchivo } from '../../data/archivos';
import type { Archivo } from '../../data/archivos';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

function colorPorTipo(tipo: string) {
  switch (tipo) {
    case 'PDF':
      return 'red';
    case 'PPT':
      return 'orange';
    case 'Word':
      return 'blue';
    default:
      return 'gray';
  }
}

function iconoPorTipo(tipo: string) {
  switch (tipo) {
    case 'PDF':
      return <FileText size={24} />;
    case 'PPT':
      return <FileSpreadsheet size={24} />;
    case 'Word':
      return <File size={24} />;
    default:
      return <File size={24} />;
  }
}

const ArchivosPage = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCurso, setNuevoCurso] = useState<string | null>(null);
  const [nuevoTipo, setNuevoTipo] = useState<string | null>(null);

  useEffect(() => {
    cargarArchivos().then(setArchivos);
    cargarCursos().then(setCursos);
  }, []);

  const cursosDisponibles = ['Todos', ...new Set(archivos.map((a) => a.curso))];

  const archivosFiltrados =
    cursoSeleccionado === 'Todos'
      ? archivos
      : archivos.filter((a) => a.curso === cursoSeleccionado);

  async function manejarSubirArchivo() {
    if (!nuevoNombre.trim() || !nuevoCurso || !nuevoTipo) return;
    await subirArchivo({
      nombre: nuevoNombre.trim(),
      curso: nuevoCurso,
      tipo: nuevoTipo,
    });
    setArchivos(await cargarArchivos());
    setNuevoNombre('');
    setNuevoCurso(null);
    setNuevoTipo(null);
    setModalAbierto(false);
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <Title order={2}>Archivos de Cursos</Title>
        <Button onClick={() => setModalAbierto(true)}>Subir Archivo</Button>
      </div>

      <div className={styles.filtros}>
        <Select
          label="Filtrar por curso"
          data={cursosDisponibles}
          value={cursoSeleccionado}
          onChange={(valor) => setCursoSeleccionado(valor || 'Todos')}
          width={250}
        />
      </div>

      <Grid>
        {archivosFiltrados.map((archivo) => (
          <Grid.Col key={archivo.id} span={4}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              className={styles.tarjeta}
            >
              <div className={styles.icono}>{iconoPorTipo(archivo.tipo)}</div>

              <Text fw="bold" size="sm" lineClamp={2}>
                {archivo.nombre}
              </Text>

              <Group gap="xs">
                <Badge color={colorPorTipo(archivo.tipo)} size="sm">
                  {archivo.tipo}
                </Badge>
                <Text size="xs" color="dimmed">
                  {archivo.curso}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  Fecha: {archivo.fecha}
                </Text>
              </Group>

              <div className={styles.tarjetaFooter}>
                <Button variant="light" size="xs" fullWidth disabled>
                  Ver
                </Button>
                <Button size="xs" fullWidth disabled>
                  Descargar
                </Button>
              </div>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Subir archivo"
      >
        <Stack gap="sm">
          <TextInput
            label="Nombre del archivo"
            placeholder="Ej: Semana4_PW.pdf"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.currentTarget.value)}
          />
          <Select
            label="Curso"
            placeholder="Selecciona un curso"
            data={cursos.map((c) => ({ value: c.nombre, label: c.nombre }))}
            value={nuevoCurso}
            onChange={setNuevoCurso}
          />
          <Select
            label="Tipo"
            placeholder="Selecciona el tipo"
            data={['PDF', 'PPT', 'Word']}
            value={nuevoTipo}
            onChange={setNuevoTipo}
          />
          <Text size="xs" c="dimmed">
            Por ahora solo se guarda la ficha del archivo (nombre, curso y
            tipo), no el archivo en sí.
          </Text>
          <Button
            fullWidth
            onClick={manejarSubirArchivo}
            disabled={!nuevoNombre.trim() || !nuevoCurso || !nuevoTipo}
          >
            Guardar
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default ArchivosPage;
