/*
===============================================================================
CONFIGURACIÓN DE RUTAS
===============================================================================

Este archivo es el encargado de configurar todas las rutas de la aplicación
utilizando React Router (Data Router).

Aquí se define:

- Qué componente debe renderizarse para cada URL.
- Qué rutas están protegidas.
- Qué Layout utilizará cada grupo de páginas.
- Qué páginas se cargarán mediante Lazy Loading.

Para conocer todas las opciones de configuración puedes consultar la
documentación oficial de React Router.

https://reactrouter.com

===============================================================================
LAYOUTS
===============================================================================

Un Layout es un componente que contiene elementos compartidos entre varias
pantallas de la aplicación.

Por ejemplo:

- Navbar
- Sidebar
- Footer
- Header

En lugar de repetir estos componentes en cada página, React Router permite
agrupar varias rutas bajo un mismo Layout mediante la propiedad `children`.

Ejemplo:

MainLayout
│
├── Home
├── Search
├── Hero
└── Favorites

De esta manera el Layout solo se renderiza una vez y React Router reemplaza
únicamente el contenido correspondiente al `children`.

===============================================================================
LAZY LOADING
===============================================================================

Por defecto, si importamos todas las páginas normalmente, el navegador deberá
descargarlas cuando inicia la aplicación.

En proyectos pequeños esto no representa un problema, pero en aplicaciones
grandes muchas páginas pueden contener librerías pesadas o funcionalidades que
el usuario quizá nunca visite.

Para evitar descargar código innecesario desde el inicio, React ofrece
`React.lazy()`.

Con Lazy Loading, el código de una página se descarga únicamente cuando el
usuario navega hacia ella.

Beneficios:

✔ Reduce el tamaño del bundle inicial.
✔ Mejora el tiempo de carga de la aplicación.
✔ Disminuye el consumo de memoria.
✔ Evita descargar componentes que probablemente no se utilizarán.

Ejemplo:

const SearchPage = lazy(() =>
    import('@/heroes/pages/search/SearchPage')
);

En este caso, `SearchPage` no se descarga cuando inicia la aplicación.
React solo solicitará ese archivo cuando el usuario visite la ruta de búsqueda.

Este comportamiento se conoce como Code Splitting y es una de las principales
técnicas de optimización en aplicaciones React.
===============================================================================
*/

import { HomePage } from "@/heroes/pages/home/HomePage";
import HeroPage from "@/heroes/pages/hero/HeroPage";
import { createHashRouter, Navigate } from "react-router";
// import { SearchPage } from "@/heroes/pages/search/SearchPage";
import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { AdminLayout } from "@/admin/layout/AdminLayout";
import { lazy } from "react";

const SearchPage = lazy(() => import("@/heroes/pages/search/SearchPage"));

export const appRouter = createHashRouter([
  {
    path: "/",
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "heroes/:idSlug",
        element: <HeroPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
]);
