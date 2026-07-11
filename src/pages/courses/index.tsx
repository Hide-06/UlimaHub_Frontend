import { Badge, Card, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { cargarCursos } from '../../data/cursos';
import type { Curso } from '../../data/cursos';

const CoursesPage = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    cargarCursos().then(setCursos);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="md">
        Mis Cursos
      </Title>

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
                <Text fw={700} size="lg">
                  {curso.nombre}
                </Text>
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
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default CoursesPage;
