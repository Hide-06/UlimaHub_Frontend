import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Select,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Registro.module.css';

const RegistroPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [ciclo, setCiclo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async () => {
    if (cargando) return;
    if (!nombre || !email || !password || !confirmar || !ciclo) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!email.endsWith('@aloe.ulima.edu.pe')) {
      setError('Debe usar su correo institucional (@aloe.ulima.edu.pe)');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, ciclo, carrera }),
      });

      if (!res.ok) {
        const datos = await res.json();
        setError(datos.error);
        return;
      }

      const usuario = await res.json();
      localStorage.setItem('usuario', JSON.stringify(usuario));
      navigate('/home');
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.contenedor}>
      <Paper className={styles.tarjeta} radius="md" p="xl" withBorder>
        <Stack className={styles.encabezado}>
          <Title order={2}>Ulima Hub</Title>
          <Text c="dimmed" size="sm">
            Crea tu cuenta institucional
          </Text>
        </Stack>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            manejarRegistro();
          }}
        >
          <Stack gap="sm">
            <TextInput
              label="Nombre completo"
              placeholder="Tu nombre y apellido"
              value={nombre}
              onChange={(e) => setNombre(e.currentTarget.value)}
            />
            <TextInput
              label="Correo institucional"
              placeholder="usuario@aloe.ulima.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Select
              label="Ciclo"
              placeholder="Selecciona tu ciclo"
              data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
              value={ciclo}
              onChange={(valor) => setCiclo(valor || '')}
            />
            <TextInput
              label="Carrera"
              placeholder="Ej: Ingeniería de Sistemas"
              value={carrera}
              onChange={(e) => setCarrera(e.currentTarget.value)}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.currentTarget.value)}
            />

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <Button type="submit" fullWidth mt="sm" loading={cargando}>
              Registrarse
            </Button>

            <Text ta="center" size="sm" c="dimmed">
              ¿Ya tienes cuenta?{' '}
              <Text
                component="span"
                c="orange"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                Inicia sesión
              </Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default RegistroPage;
