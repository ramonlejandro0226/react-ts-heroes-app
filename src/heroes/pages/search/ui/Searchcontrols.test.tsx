import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchControls } from './SearchControls';
import { MemoryRouter } from 'react-router';

// Radix UI requiere ResizeObserver en el entorno de pruebas.
if (typeof window.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

// Encapsula el componente con un router para poder leer y modificar query params.
const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>
  );
};

// Agrupa las pruebas de la búsqueda y los filtros avanzados.
describe('SearchControls', () => {
  // Comprueba el render inicial y genera la referencia visual del componente.
  test('should render SearchControls with default values', () => {
    const { container } = renderWithRouter();

    expect(container).toMatchSnapshot();
  });

  // Verifica que el input tome el valor enviado por el parámetro name.
  test('should set input value when search param name is set', () => {
    renderWithRouter(['/?name=Batman']);

    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...'
    );

    expect(input.getAttribute('value')).toBe('Batman');
  });

  // Comprueba que presionar Enter actualice el parámetro name.
  test('should change params when input is changed and enter is pressed', () => {
    renderWithRouter(['/?name=Batman']);
    const input = screen.getByPlaceholderText(
      'Search heroes, villains, powers, teams...'
    );
    expect(input.getAttribute('value')).toBe('Batman');

    fireEvent.change(input, { target: { value: 'Superman' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input.getAttribute('value')).toBe('Superman');
  });

  // Comprueba que el slider aumente la fuerza desde 0 hasta 1.
  test('should change params strength when slider is changed', () => {
    renderWithRouter(['/?name=Batman&active-accordion=advance-filters']);
    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(slider.getAttribute('aria-valuenow')).toBe('1');
  });

  // Verifica que el acordeón aparezca abierto con su parámetro activo.
  test('should accordion be open when active-accordion param is set', () => {
    renderWithRouter(['/?name=Batman&active-accordion=advance-filters']);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    expect(accordionItem?.getAttribute('data-state')).toBe('open');
  });

  // Verifica que el acordeón permanezca cerrado sin el parámetro activo.
  test('should accordion be closed when active-accordion param is not set', () => {
    renderWithRouter(['/?name=Batman']);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');

    expect(accordionItem?.getAttribute('data-state')).toBe('closed');
  });
});