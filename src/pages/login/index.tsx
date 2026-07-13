import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Anchor,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './Login.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async () => {
    if (cargando) return;
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Correo electrónico o contraseña incorrectos');
        return;
      }

      const usuario = await res.json();
      localStorage.setItem('usuario', JSON.stringify(usuario));
      navigate('/home');
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo');
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className={styles.contenedor}>
      <Paper className={styles.tarjeta} radius="md" p="xl" withBorder>
        <Stack className={styles.encabezado}>
          <Title order={2}>UlimaHub</Title>
          <Text color="dimmed">Inicia sesión para continuar</Text>
        </Stack>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            manejarLogin();
          }}
        >
          <Stack>
            <TextInput
              label="Correo electrónico"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {error && <Text color="red">{error}</Text>}
            <Button type="submit" fullWidth mt="sm" loading={cargando}>
              Iniciar sesión
            </Button>
            <Text ta="center" size="sm" color="dimmed">
              ¿No tienes una cuenta?{' '}
              <Anchor href="/register">Regístrate</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};
export default LoginPage;
