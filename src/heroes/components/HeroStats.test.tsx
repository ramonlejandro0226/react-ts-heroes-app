import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSummary } from "../hooks/useHeroSummary";
import { use } from "react";

import type { SummaryInformationResponse } from "../types/summary-information.response";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "@/context/FavoriteHeroContext";

vi.mock("../hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary);

const mockSummaryData = {
  totalHeroes: 25,
  strongestHero: {
    id: "1",
    name: "Clark Kent",
    slug: "clark-kent",
    alias: "Superman",
    powers: [
      "Súper fuerza",
      "Vuelo",
      "Visión de calor",
      "Visión de rayos X",
      "Invulnerabilidad",
      "Súper velocidad",
    ],
    description:
      "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
    strength: 10,
    intelligence: 8,
    speed: 9,
    durability: 10,
    team: "Liga de la Justicia",
    image: "1.jpeg",
    firstAppearance: "1938",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  smartestHero: {
    id: "2",
    name: "Bruce Wayne",
    slug: "bruce-wayne",
    alias: "Batman",
    powers: [
      "Artes marciales",
      "Habilidades de detective",
      "Tecnología avanzada",
      "Sigilo",
      "Genio táctico",
    ],
    description:
      "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
    strength: 6,
    intelligence: 10,
    speed: 6,
    durability: 7,
    team: "Liga de la Justicia",
    image: "2.jpeg",
    firstAppearance: "1939",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  heroCount: 18,
  villainCount: 7,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderHeroStats = (mockData?: Partial<SummaryInformationResponse>) => {
  mockUseHeroSummary.mockReturnValue({
    data: mockData,
  } as unknown as ReturnType<typeof useHeroSummary>);

  return render(
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroProvider>
        <HeroStats />
      </FavoriteHeroProvider>
    </QueryClientProvider>,
  );
};

const ToggleFavoriteButton = () => {
  const { toggleFavorite } = use(FavoriteHeroContext);

  return (
    <button onClick={() => toggleFavorite(mockSummaryData.strongestHero)}>
      Agregar favorito
    </button>
  );
};

// Verifica el estado de carga, los datos mostrados y el porcentaje de favoritos.
describe("HeroStats", () => {
  // Comprueba que se muestre Loading mientras no exista información.
  test("should render component with defaul value ", () => {
    renderHeroStats();

    expect(screen.getByText("Loading...")).toBeDefined();

    screen.debug();
  });

  // Verifica que los datos de resumen se rendericen en sus tarjetas.
  test("should render  HeroStats with  mock  information", () => {
    const { container } = renderHeroStats(mockSummaryData);
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Total de personajes")).toBeDefined();
    expect(screen.getByText("Favoritos")).toBeDefined();
    expect(screen.getByText("Fuertes")).toBeDefined();
  });

  // Comprueba que agregar un favorito actualice el porcentaje calculado.
  test("should change the percentage of favorite heroes when one is added", () => {
    localStorage.clear();
    mockUseHeroSummary.mockReturnValue({
      data: mockSummaryData,
    } as unknown as ReturnType<typeof useHeroSummary>);

    render(
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroProvider>
          <HeroStats />
          <ToggleFavoriteButton />
        </FavoriteHeroProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("0.00 of total")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Agregar favorito" }));

    expect(screen.getByText("4.00 of total")).toBeDefined();
  });
});
