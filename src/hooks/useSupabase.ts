import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

export function useSupabaseQuery<T extends keyof Tables>(
  table: T,
  query?: string
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryBuilder = supabase.from(table).select('*');
      
      if (query) {
        queryBuilder = queryBuilder.or(query);
      }
      
      const { data: result, error: fetchError } = await queryBuilder;
      
      if (fetchError) {
        throw fetchError;
      }
      
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, query]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export function useSupabaseMutation<T extends keyof Tables>(table: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: Tables[T]['Insert']) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inserir';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Tables[T]['Update']) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao eliminar';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { insert, update, remove, loading, error };
}