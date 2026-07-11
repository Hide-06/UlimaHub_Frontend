import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@/index.css';
import router from '@/app/router';
import theme from '@/app/theme';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </MantineProvider>
  </StrictMode>
);
