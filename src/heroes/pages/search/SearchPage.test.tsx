import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SearchPage from './SearchPage';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { searchHeroAction } from '@/heroes/actions/search-hero.action';
import type { Hero } from '@/heroes/types/heroes.interface';

vi.mock('@/heroes/actions/search-hero.action');
const mockSearchHeroAction = vi.mocked(searchHeroAction);

vi.mock('@/components/custom/CustomJumbotron', () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotron"></div>,
}));

vi.mock('./ui/SearchControls', () => ({
  SearchControls: () => <div data-testid="search-controls"></div>,
}));

vi.mock('@/heroes/components/HeroGrid', () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

const queryClient = new QueryClient();

const renderSearchPage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

// Agrupa las pruebas de navegación por parámetros y resultados de búsqueda.
describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    mockSearchHeroAction.mockResolvedValue([]);
  });

  // Comprueba que la página se renderice sin filtros activos.
  test('should render SearchPage with default values', () => {
    const { container } = renderSearchPage();

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: undefined,
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
  });

  // Verifica que el parámetro name llegue a la acción de búsqueda.
  test('should call search action with name parameter', () => {
    const { container } = renderSearchPage(['/search?name=superman']);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: 'superman',
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
  });

  // Verifica que el parámetro strength llegue a la acción de búsqueda.
  test('should call search action with strength parameter', () => {
    const { container } = renderSearchPage(['/search?strength=6']);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: undefined,
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
      strength: '6',
    });

    expect(container).toMatchSnapshot();
  });

  // Comprueba que puedan combinarse name y strength en la consulta.
  test('should call search action with strength and name parameters', () => {
    const { container } = renderSearchPage(['/search?strength=8&name=batman']);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: 'batman',
      team: undefined,
      category: undefined,
      universe: undefined,
      status: undefined,
      strength: '8',
    });

    expect(container).toMatchSnapshot();
  });

  // Verifica que los héroes devueltos por la acción se muestren en la cuadrícula.
  test('should render HeroGrid with search results', async () => {
    const mockHeroes = [
      { id: '1', name: 'Clark Kent' } as unknown as Hero,
      { id: '2', name: 'Bruce Wayne' } as unknown as Hero,
    ];

    mockSearchHeroAction.mockResolvedValue(mockHeroes);

    renderSearchPage();

    await waitFor(() => {
      expect(screen.getByText('Clark Kent')).toBeDefined();
      expect(screen.getByText('Bruce Wayne')).toBeDefined();
    });
  });
});