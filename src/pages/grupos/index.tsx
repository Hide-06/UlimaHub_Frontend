import { Badge, Button, Card, Grid, Text, Title, Group } from '@mantine/core';
import { Users, BookOpen, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Grupos.module.css';
import { cargarGrupos, unirseAGrupo } from '../../data/grupos';
import type { Grupo } from '../../data/grupos';

const GruposPage = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarGrupos().then(setGrupos);
  }, []);

  async function manejarUnirse(id: number) {
    setGrupos(
      grupos.map((g) =>
        g.id === id ? { ...g, unido: true, miembros: g.miembros + 1 } : g
      )
    );
    await unirseAGrupo(id);
  }

  function irAlChat(grupo: Grupo) {
    sessionStorage.setItem('grupoActivo', JSON.stringify(grupo));
    navigate('/chat');
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <Title order={2}>Grupos de Estudio</Title>
        <Button>Crear grupo</Button>
      </div>

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
              <Text fw={700} size="md">
                {grupo.nombre}
              </Text>

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
    </div>
  );
};

export default GruposPage;
