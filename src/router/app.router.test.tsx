import { describe, expect, test, vi } from 'vitest';
import { appRouter } from './app.router';
import { render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from 'react-router';

// Se reemplaza el layout por una versión mínima que conserva el <Outlet>.
vi.mock('@/heroes/layouts/HeroesLayout', () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));

// Las páginas se sustituyen por componentes sencillos para probar solo el routing.
vi.mock('@/heroes/pages/home/HomePage', () => ({
  HomePage: () => <div data-testid="home-page"></div>,
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
  default: () => {
    const { idSlug = '' } = useParams();

    return <div data-testid="hero-page">HeroPage - {idSlug}</div>;
  },
}));

vi.mock('@/heroes/pages/search/SearchPage', () => ({
  default: () => <div data-testid="search-page"></div>,
}));

describe('appRouter', () => {
  // Verifica que la estructura de rutas no haya cambiado accidentalmente.
  test('should be configured as expected', () => {
    expect(appRouter.routes).toMatchSnapshot();
  });

  test('should render home page at root path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('home-page')).toBeDefined();
  });

  // Comprueba que la ruta dinámica entregue su idSlug al componente Hero.
  test('should render hero page at /heroes/:idSlug path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/heroes/superman'],
    });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');
  });

  // Verifica que la ruta de búsqueda renderice su página mockeada.
  test('should render search page at /search path', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/search'],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('search-page')).toBeDefined();
  });

  // Comprueba que una ruta desconocida redirija a la página principal.
  test('should redirect to home page for unknown routes', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/otra-pagina-rara'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('home-page')).toBeDefined();
  });
});