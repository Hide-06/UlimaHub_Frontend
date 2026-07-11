import { Navigate, Outlet } from 'react-router';

const RutaProtegida = () => {
  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default RutaProtegida;
