import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

// Mock dos hooks
vi.mock('../../hooks/useSupabase', () => ({
  useSupabaseQuery: vi.fn(() => ({
    data: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useSupabaseMutation: vi.fn(() => ({
    insert: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    loading: false,
  })),
}));

describe('App Integration Tests', () => {
  it('deve renderizar dashboard por padrão', () => {
    render(<App />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Professores')).toBeInTheDocument();
  });

  it('deve navegar entre diferentes seções', async () => {
    render(<App />);

    // Navegar para Professores
    fireEvent.click(screen.getByText('Professores'));
    await waitFor(() => {
      expect(screen.getByText('Adicionar Professor')).toBeInTheDocument();
    });

    // Navegar para Turmas
    fireEvent.click(screen.getByText('Turmas'));
    await waitFor(() => {
      expect(screen.getByText('Criar Turma')).toBeInTheDocument();
    });

    // Navegar para Contactos
    fireEvent.click(screen.getByText('Contactos'));
    await waitFor(() => {
      expect(screen.getByText('Registar Contacto')).toBeInTheDocument();
    });
  });

  it('deve mostrar layout correto', () => {
    render(<App />);

    expect(screen.getByText('EduManager')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestão')).toBeInTheDocument();
  });
});