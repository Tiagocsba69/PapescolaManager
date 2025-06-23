import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSupabaseQuery, useSupabaseMutation } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';

describe('useSupabaseQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar dados com sucesso', async () => {
    const mockData = [{ id: '1', nome: 'Test Professor' }];
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    } as any);

    const { result } = renderHook(() => useSupabaseQuery('professores'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('deve lidar com erros', async () => {
    const mockError = new Error('Database error');
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      }),
    } as any);

    const { result } = renderHook(() => useSupabaseQuery('professores'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Database error');
    expect(result.current.data).toEqual([]);
  });
});

describe('useSupabaseMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inserir dados com sucesso', async () => {
    const mockData = { id: '1', nome: 'New Professor' };
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useSupabaseMutation('professores'));

    const insertData = { nome: 'New Professor' };
    const response = await result.current.insert(insertData);

    expect(response).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('deve atualizar dados com sucesso', async () => {
    const mockData = { id: '1', nome: 'Updated Professor' };
    
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useSupabaseMutation('professores'));

    const updateData = { nome: 'Updated Professor' };
    const response = await result.current.update('1', updateData);

    expect(response).toEqual(mockData);
  });

  it('deve eliminar dados com sucesso', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      }),
    } as any);

    const { result } = renderHook(() => useSupabaseMutation('professores'));

    const response = await result.current.remove('1');

    expect(response).toBe(true);
  });
});