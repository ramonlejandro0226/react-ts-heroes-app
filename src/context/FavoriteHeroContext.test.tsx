import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "@/heroes/types/heroes.interface";

// Hero de prueba utilizado por todos los casos de la suite.
const mokcHero = {
  id: "1",
  name: "batman",
} as Hero;

// Componente auxiliar que consume el contexto y expone sus valores en el DOM.
const TestComponent = () => {
  // Se extraen del contexto los datos y funciones que se desean comprobar.
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      {/* Muestra la cantidad actual de heroes favoritos. */}
      <div data-testid="favorite-count">{favoriteCount}</div>

      {/* Renderiza cada hero favorito para poder verificar su presencia. */}
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      {/* Boton que activa la accion para agregar o quitar el hero de prueba. */}
      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mokcHero)}
      >
        Toogle Favorite
      </button>

      {/* Indica si el hero de prueba esta actualmente marcado como favorito. */}
      <div data-testid="is-favorite">{isFavorite(mokcHero).toString()}</div>
    </div>
  );
};

// Encapsula el montaje del proveedor con el componente que consume el contexto.
const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

// Agrupa las pruebas relacionadas con el estado de heroes favoritos.
describe("favoriteHeroContext", () => {
  // Limpia el almacenamiento antes de cada prueba para aislar los resultados.
  beforeEach(() => {
    localStorage.clear();
  });

  // Comprueba que el contexto comienza sin heroes favoritos.
  test("should inialize with default value", () => {
    renderContextTest();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").childElementCount).toBe(0);
  });

  // Comprueba que agregar un nuevo hero actualiza el estado y localStorage.
  test("should add favorite hero when toggleFavorite is called with new hero", () => {
    renderContextTest();

    // Se obtiene el elemento que ejecuta la accion toggleFavorite.
    const button = screen.getByTestId("toggle-favorite");

    // Se simula un clic para agregar el hero.
    fireEvent.click(button);

    // screen.debug();
    console.log(localStorage.getItem("favorites"));

    // Verifica el contador, el estado booleano, el hero mostrado y la persistencia.
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");
    expect(localStorage.getItem("favorites")).toBe(
      '[{"id":"1","name":"batman"}]',
    );
  });

  // Comprueba que quitar un hero favorito actualiza el estado y la interfaz.
  test("should remove favorite hero when toggleFavorite is called ", () => {
    // Prepara un favorito existente directamente en el almacenamiento.
    localStorage.setItem("favorites", JSON.stringify([mokcHero]));
    console.log(localStorage.getItem("favorites"));
   
    renderContextTest();
    // Confirma que el proveedor carga correctamente el dato inicial.
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    // Ejecuta toggleFavorite para eliminar el hero cargado.
    const button = screen.getByTestId("toggle-favorite");
    fireEvent.click(button);

    screen.debug();

    // Verifica que el contador y el estado vuelvan a vacio y que el elemento desaparezca.
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();

  });
});
