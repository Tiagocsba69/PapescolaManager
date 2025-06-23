import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Professores from '../../components/Professores';

// Mock com muitos dados para teste de performance
const generateMockProfessores = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    nome: `Professor ${i}`,
    telefone: `+351 21 ${String(i).padStart(3, '0')} ${String(i).padStart(4, '0')}`,
    email: `professor${i}@escola.com`,
    cargo: 'Professor Auxiliar',
    departamento: 'Matemática',
    status: 'ativo' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }));
};

vi.mock('../../hooks/useSupabase', () => ({
  useSupabaseQuery: vi.fn(() => ({
    data: generateMockProfessores(1000), // 1000 professores para teste
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

describe('Component Performance Tests', () => {
  it('deve renderizar lista grande de professores em tempo aceitável', () => {
    const startTime = performance.now();
    
    render(<Professores />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Deve renderizar em menos de 1 segundo
    expect(renderTime).toBeLessThan(1000);
  });
});