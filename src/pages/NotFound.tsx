import { Link } from 'react-router';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notFound">
      <div className="notFound-code">404</div>
      <h1 className="notFound-title">Página no encontrada</h1>
      <img
        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTg0YTdvc2kxOHhxYnUyeHB6ZnI3bjdyOWI0andkcWpjN2tpMjgzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H54feNXf6i4eAQubud/giphy.gif"
        alt="404 Gif"
        className="notFound-gif"
      />
      <p className="notFound-subtitle">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/home" className="notFound-btn">
        Volver al inicio
      </Link>
    </div>
  );
}
