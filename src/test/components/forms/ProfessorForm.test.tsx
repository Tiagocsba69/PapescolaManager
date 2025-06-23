import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProfessorForm from '../../../components/forms/ProfessorForm';
import { mockProfessores } from '../../mocks/data';

describe('ProfessorForm Component', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar formulário vazio para novo professor', () => {
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Adicionar Professor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome Completo/)).toHaveValue('');
    expect(screen.getByLabelText(/Email/)).toHaveValue('');
  });

  it('deve preencher formulário ao editar professor', () => {
    const professor = mockProfessores[0];
    
    render(
      <ProfessorForm
        professor={professor}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Editar Professor')).toBeInTheDocument();
    expect(screen.getByDisplayValue(professor.nome)).toBeInTheDocument();
    expect(screen.getByDisplayValue(professor.email)).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Adicionar Professor');
    await user.click(submitButton);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve validar formato de email', async () => {
    const user = userEvent.setup();
    
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const emailInput = screen.getByLabelText(/Email/);
    await user.type(emailInput, 'email-invalido');

    const submitButton = screen.getByText('Adicionar Professor');
    await user.click(submitButton);

    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('deve submeter formulário com dados válidos', async () => {
    const user = userEvent.setup();
    
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText(/Nome Completo/), 'Prof. Teste');
    await user.type(screen.getByLabelText(/Email/), 'teste@escola.com');
    await user.type(screen.getByLabelText(/Telefone/), '+351 21 123 4567');
    await user.selectOptions(screen.getByLabelText(/Cargo/), 'Professor Auxiliar');
    await user.selectOptions(screen.getByLabelText(/Departamento/), 'Matemática');

    const submitButton = screen.getByText('Adicionar Professor');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        nome: 'Prof. Teste',
        email: 'teste@escola.com',
        telefone: '+351 21 123 4567',
        cargo: 'Professor Auxiliar',
        departamento: 'Matemática',
        status: 'ativo',
      });
    });
  });

  it('deve cancelar formulário', async () => {
    const user = userEvent.setup();
    
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('deve desabilitar campos durante loading', () => {
    render(
      <ProfessorForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByLabelText(/Nome Completo/)).toBeDisabled();
    expect(screen.getByLabelText(/Email/)).toBeDisabled();
    expect(screen.getByText('Adicionar Professor')).toBeDisabled();
  });
});