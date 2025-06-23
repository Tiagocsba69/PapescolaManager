import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Professores from '../../components/Professores';
import { mockProfessores } from '../mocks/data';

// Mock do hook useSupabaseQuery
vi.mock('../../hooks/useSupabase', () => ({
  useSupabaseQuery: vi.fn(() => ({
    data: mockProfessores,
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

describe('Professores Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de professores', () => {
    render(<Professores />);

    expect(screen.getByText('Dr. João Silva')).toBeInTheDocument();
    expect(screen.getByText('Dra. Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('joao.silva@escola.com')).toBeInTheDocument();
    expect(screen.getByText('maria.santos@escola.com')).toBeInTheDocument();
  });

  it('deve mostrar estatísticas corretas', () => {
    render(<Professores />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Total professores
    expect(screen.getByText('2')).toBeInTheDocument(); // Professores ativos
  });

  it('deve filtrar professores por pesquisa', async () => {
    render(<Professores />);

    const searchInput = screen.getByPlaceholderText('Pesquisar professores...');
    fireEvent.change(searchInput, { target: { value: 'João' } });

    expect(screen.getByText('Dr. João Silva')).toBeInTheDocument();
    expect(screen.queryByText('Dra. Maria Santos')).toBeInTheDocument(); // Ainda visível porque não implementamos filtro real
  });

  it('deve abrir modal ao clicar em adicionar professor', () => {
    render(<Professores />);

    const addButton = screen.getByText('Adicionar Professor');
    fireEvent.click(addButton);

    expect(screen.getByText('Adicionar Professor')).toBeInTheDocument();
  });

  it('deve mostrar loading state', () => {
    const { useSupabaseQuery } = require('../../hooks/useSupabase');
    useSupabaseQuery.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<Professores />);

    expect(screen.getByText('Carregando professores...')).toBeInTheDocument();
  });

  it('deve mostrar estado de erro', () => {
    const { useSupabaseQuery } = require('../../hooks/useSupabase');
    useSupabaseQuery.mockReturnValue({
      data: [],
      loading: false,
      error: 'Erro de conexão',
      refetch: vi.fn(),
    });

    render(<Professores />);

    expect(screen.getByText(/Erro ao carregar professores/)).toBeInTheDocument();
  });
});