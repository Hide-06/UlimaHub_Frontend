import { useEffect, useState } from 'react';
import {
  ActionIcon,
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
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { cargarEventos, crearEvento, eliminarEvento } from '../../data/eventos';
import type { Evento } from '../../data/eventos';

function colorTipo(tipo: string) {
  return tipo === 'examen' ? 'red' : 'brand';
}

function getCeldas(mes: Dayjs): (number | null)[] {
  const primero = mes.startOf('month');
  const dow = primero.day();
  const offset = dow === 0 ? 6 : dow - 1;
  const celdas: (number | null)[] = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= primero.daysInMonth(); d++) celdas.push(d);
  return celdas;
}

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

const estiloBoton = (
  seleccionado: boolean,
  esHoy: boolean,
  tieneEvento: boolean
): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  height: 32,
  padding: 0,
  margin: 0,
  textAlign: 'center',
  lineHeight: '32px',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: tieneEvento ? 700 : 400,
  textDecoration: tieneEvento ? 'underline' : 'none',
  background: seleccionado
    ? 'var(--mantine-primary-color-filled)'
    : esHoy
      ? 'var(--mantine-color-default-border)'
      : 'transparent',
  color: seleccionado ? '#fff' : 'var(--mantine-color-text)',
});

const CalendarPage = () => {
  const hoy = dayjs();
  const [mesViendo, setMesViendo] = useState(() => dayjs());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEventos()
      .then(setEventos)
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  const celdas = getCeldas(mesViendo);

  const eventosDelDia = diaSeleccionado
    ? eventos.filter((e) => e.fecha === diaSeleccionado)
    : [];

  const eventosFuturos = eventos
    .filter((e) => !dayjs(e.fecha).isBefore(hoy, 'day'))
    .sort((a, b) => dayjs(a.fecha).diff(dayjs(b.fecha)));

  async function agregarEvento() {
    if (!nuevoTitulo.trim() || !nuevoTipo || !diaSeleccionado) return;
    await crearEvento({
      fecha: diaSeleccionado,
      titulo: nuevoTitulo.trim(),
      tipo: nuevoTipo,
    });
    setEventos(await cargarEventos());
    setNuevoTitulo('');
    setNuevoTipo(null);
    setModalAbierto(false);
  }

  async function manejarEliminarEvento(id: number) {
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return;
    setEventos(eventos.filter((e) => e.id !== id));
    await eliminarEvento(id);
  }

  return (
    <div style={{ padding: 20 }}>
      <Title order={2} mb="md">
        Calendario
      </Title>

      {cargando && (
        <Text c="dimmed" mb="md">
          Cargando calendario...
        </Text>
      )}

      {error && (
        <Text c="red" mb="md">
          {error}
        </Text>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="sm">
            <ActionIcon
              variant="subtle"
              onClick={() => setMesViendo((m) => m.subtract(1, 'month'))}
            >
              {'<'}
            </ActionIcon>
            <Text fw={600} size="sm">
              {mesViendo.format('MMMM YYYY')}
            </Text>
            <ActionIcon
              variant="subtle"
              onClick={() => setMesViendo((m) => m.add(1, 'month'))}
            >
              {'>'}
            </ActionIcon>
          </Group>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginBottom: 4,
            }}
          >
            {DIAS.map((d) => (
              <Text key={d} size="xs" ta="center" c="dimmed" fw={600}>
                {d}
              </Text>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: 2,
            }}
          >
            {celdas.map((dia, i) => {
              if (!dia) return <div key={i} style={{ height: 32 }} />;
              const fechaStr = mesViendo.date(dia).format('YYYY-MM-DD');
              const tieneEvento = eventos.some((e) => e.fecha === fechaStr);
              const seleccionado = fechaStr === diaSeleccionado;
              const esHoy = mesViendo.date(dia).isSame(hoy, 'day');
              return (
                <button
                  key={i}
                  onClick={() =>
                    setDiaSeleccionado(seleccionado ? null : fechaStr)
                  }
                  style={estiloBoton(seleccionado, esHoy, tieneEvento)}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          {diaSeleccionado ? (
            <>
              <Group justify="space-between" mb="sm">
                <Text fw={600}>
                  {dayjs(diaSeleccionado).format('D [de] MMMM')}
                </Text>
                <Button size="xs" onClick={() => setModalAbierto(true)}>
                  + Evento
                </Button>
              </Group>
              {eventosDelDia.length > 0 ? (
                <Stack gap="xs" mb="md">
                  {eventosDelDia.map((ev) => (
                    <Card key={ev.id} padding="sm" radius="sm" withBorder>
                      <Group justify="space-between">
                        <div>
                          <Badge color={colorTipo(ev.tipo)} size="xs" mb={4}>
                            {ev.tipo}
                          </Badge>
                          <Text size="sm">{ev.titulo}</Text>
                        </div>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          px={6}
                          onClick={() => manejarEliminarEvento(ev.id)}
                        >
                          ✕
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" size="sm" mb="md">
                  No hay eventos este dia
                </Text>
              )}
            </>
          ) : (
            <Text c="dimmed" size="sm" mb="md">
              Selecciona un dia para ver los eventos
            </Text>
          )}

          <Text fw={600} mb="sm">
            Proximos eventos
          </Text>
          <Stack gap="xs">
            {eventosFuturos.map((ev) => (
              <Card key={ev.id} padding="xs" radius="sm" withBorder>
                <Badge color={colorTipo(ev.tipo)} size="xs" mb={2}>
                  {ev.tipo}
                </Badge>
                <Text size="sm">{ev.titulo}</Text>
                <Text size="xs" c="dimmed">
                  {dayjs(ev.fecha).format('D MMM')}
                </Text>
              </Card>
            ))}
          </Stack>
        </Card>
      </div>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={`Nuevo evento — ${diaSeleccionado ? dayjs(diaSeleccionado).format('D [de] MMMM') : ''}`}
      >
        <Stack gap="sm">
          <TextInput
            label="Titulo"
            placeholder="Ej: Examen final"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.currentTarget.value)}
          />
          <Select
            label="Tipo"
            placeholder="Selecciona el tipo"
            data={[
              { value: 'tarea', label: 'Tarea' },
              { value: 'examen', label: 'Examen' },
            ]}
            value={nuevoTipo}
            onChange={setNuevoTipo}
          />
          <Button
            fullWidth
            onClick={agregarEvento}
            disabled={!nuevoTitulo.trim() || !nuevoTipo}
          >
            Agregar
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default CalendarPage;
