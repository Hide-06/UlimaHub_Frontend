# ULima Hub — Frontend

ULima Hub es una plataforma académica para estudiantes de la Universidad de Lima.
Centraliza cursos, tareas, calendario, notas, chat y archivos en un solo sistema.

---

# Stack tecnológico

- [React-Vite-Ts-template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
- [React Router](https://reactrouter.com/)
- [Mantine UI](https://mantine.dev/)

---

# Estructura de carpetas

```txt
src/
│
├── main.tsx
│
├── app/
│   ├── layouts/
│   ├── theme/
│   └── RutaProtegida.tsx
│
├── pages/
│   ├── home/
│   ├── login/
│   ├── registro/
│   ├── courses/
│   ├── tasks/
│   ├── calendar/
│   ├── notes/
│   ├── grupos/
│   ├── archivos/
│   ├── chat/
│   ├── user/
│   └── search/
│
├── data/
│
├── components/
│
├── hooks/
│
├── types/
│
└── utils/
```

---

# Backend

El backend de este proyecto vive en un repositorio aparte: `UlimaHub_Backend`.

## Cómo correr el proyecto completo

1. Clonar y levantar el backend (ver el README de ese repo para instalar Postgres y las variables de entorno).

2. En este repo, crear un archivo `.env.local` con la URL del backend en local:

```
VITE_API_URL=http://localhost:3000
```

3. Instalar dependencias y correr:

```
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

Para producción, la variable `VITE_API_URL` se toma de `.env.production` y debe apuntar al backend ya deployado.
