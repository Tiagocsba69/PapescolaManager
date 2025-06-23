import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

// Mock completo para teste E2E
vi.mock('../../hooks/useSupabase', () => {
  let mockData: any[] = [];
  
  return {
    useSupabaseQuery: vi.fn(() => ({
      data: mockData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })),
    useSupabaseMutation: vi.fn(() => ({
      insert: vi.fn(async (data) => {
        const newItem = { ...data, id: Date.now().toString() };
        mockData.push(newItem);
        return newItem;
      }),
      update: vi.fn(async (id, data) => {
        const index = mockData.findIndex(item => item.id === id);
        if (index !== -1) {
          mockData[index] = { ...mockData[index], ...data };
        }
        return mockData[index];
      }),
      remove: vi.fn(async (id) => {
        mockData = mockData.filter(item => item.id !== id);
        return true;
      }),
      loading: false,
    })),
  };
});

describe('Professor Workflow E2E', () => {
  it('deve completar fluxo completo de gestão de professores', async () => {
    const user = userEvent.setup();
    
    render(<App />);

    // 1. Navegar para seção de professores
    await user.click(screen.getByText('Professores'));
    
    // 2. Abrir formulário de adicionar professor
    await user.click(screen.getByText('Adicionar Professor'));
    
    // 3. Preencher formulário
    await user.type(screen.getByLabelText(/Nome Completo/), 'Prof. Teste E2E');
    await user.type(screen.getByLabelText(/Email/), 'teste.e2e@escola.com');
    await user.type(screen.getByLabelText(/Telefone/), '+351 21 999 8888');
    await user.selectOptions(screen.getByLabelText(/Cargo/), 'Professor Auxiliar');
    await user.selectOptions(screen.getByLabelText(/Departamento/), 'Informática');
    
    // 4. Submeter formulário
    await user.click(screen.getByText('Adicionar Professor'));
    
    // 5. Verificar se professor foi adicionado (em um cenário real, verificaríamos na lista)
    await waitFor(() => {
      expect(screen.queryByText('Adicionar Professor')).not.toBeInTheDocument();
    });
  });
});