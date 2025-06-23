import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../../components/Dashboard';
import { mockProfessores, mockTurmas, mockContactos } from '../mocks/data';

describe('Dashboard Component', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar estatísticas corretas', () => {
    render(
      <Dashboard
        professores={mockProfessores}
        turmas={mockTurmas}
        contactos={mockContactos}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total professores
    expect(screen.getByText('1')).toBeInTheDocument(); // Turmas ativas
  });

  it('deve navegar ao clicar nos botões de ação rápida', () => {
    render(
      <Dashboard
        professores={mockProfessores}
        turmas={mockTurmas}
        contactos={mockContactos}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.click(screen.getByText('Adicionar Professor'));
    expect(mockOnNavigate).toHaveBeenCalledWith('professores');

    fireEvent.click(screen.getByText('Criar Turma'));
    expect(mockOnNavigate).toHaveBeenCalledWith('turmas');

    fireEvent.click(screen.getByText('Registar Contacto'));
    expect(mockOnNavigate).toHaveBeenCalledWith('contactos');
  });

  it('deve mostrar atividades recentes', () => {
    render(
      <Dashboard
        professores={mockProfessores}
        turmas={mockTurmas}
        contactos={mockContactos}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('Atividades Recentes')).toBeInTheDocument();
  });

  it('deve mostrar estado do sistema', () => {
    render(
      <Dashboard
        professores={mockProfessores}
        turmas={mockTurmas}
        contactos={mockContactos}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('Estado do Sistema')).toBeInTheDocument();
    expect(screen.getByText('Base de Dados')).toBeInTheDocument();
    expect(screen.getByText('Servidor')).toBeInTheDocument();
  });
});