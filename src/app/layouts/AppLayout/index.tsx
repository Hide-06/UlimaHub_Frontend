import { Link, useNavigate } from 'react-router';
import { AppShell, Burger, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import './AppLayout.css';
import Logo from '@/components/ui/Logo';
import {
  House,
  BookOpen,
  SquareCheck,
  UsersRound,
  CalendarDays,
  FileText,
  Notebook,
  Search,
  MessageCircle,
  UserCircle,
  LogOut,
} from 'lucide-react';

const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  function cerrarSesion() {
    sessionStorage.clear();
    localStorage.removeItem('usuario');
    navigate('/');
  }

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: opened ? 220 : 70,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <AppShell.Header style={{ background: '#1e1e1e' }}>
        <Flex align="center" gap="sm" px={10} h="100%">
          <Burger opened={opened} onClick={toggle} color="white" />
          <h2 style={{ color: 'white', margin: 0, fontSize: 18 }}>Ulima Hub</h2>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar
        className={`sidebar ${opened ? 'expanded' : 'collapsed'}`}
      >
        <div className="logo-container">
          <Logo />
        </div>
        <ul className="menu-list">
          <Link to="/home" className="menu-item" title="Inicio">
            <House size={20} className="menu-icon" />
            <span className="menu-label">Inicio</span>
          </Link>
          <Link to="/courses" className="menu-item" title="Cursos">
            <BookOpen size={20} className="menu-icon" />
            <span className="menu-label">Cursos</span>
          </Link>
          <Link to="/tasks" className="menu-item" title="Tareas">
            <SquareCheck size={20} className="menu-icon" />
            <span className="menu-label">Tareas</span>
          </Link>
          <Link to="/calendar" className="menu-item" title="Calendario">
            <CalendarDays size={20} className="menu-icon" />
            <span className="menu-label">Calendario</span>
          </Link>
          <Link to="/teams" className="menu-item" title="Grupos">
            <UsersRound size={20} className="menu-icon" />
            <span className="menu-label">Grupos</span>
          </Link>
          <Link to="/files" className="menu-item" title="Archivos">
            <FileText size={20} className="menu-icon" />
            <span className="menu-label">Archivos</span>
          </Link>
          <Link to="/notes" className="menu-item" title="Apuntes">
            <Notebook size={20} className="menu-icon" />
            <span className="menu-label">Apuntes</span>
          </Link>
          <Link to="/search" className="menu-item" title="Busqueda">
            <Search size={20} className="menu-icon" />
            <span className="menu-label">Busqueda</span>
          </Link>
          <Link to="/chat" className="menu-item" title="Chat">
            <MessageCircle size={20} className="menu-icon" />
            <span className="menu-label">Chat</span>
          </Link>
          <Link to="/user" className="menu-item" title="Perfil">
            <UserCircle size={20} className="menu-icon" />
            <span className="menu-label">Perfil</span>
          </Link>
        </ul>

        <button
          className="menu-item logout-btn"
          onClick={cerrarSesion}
          title="Cerrar sesion"
        >
          <LogOut size={20} className="menu-icon" />
          <span className="menu-label">Salir</span>
        </button>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
