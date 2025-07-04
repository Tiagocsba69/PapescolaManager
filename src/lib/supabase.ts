import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente Supabase não encontradas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  throw new Error('Missing Supabase environment variables');
}

// Validar formato da URL
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('VITE_SUPABASE_URL não é uma URL válida:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

// Validar formato da chave (deve ser um JWT)
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('VITE_SUPABASE_ANON_KEY não parece ser uma chave JWT válida');
  throw new Error('Invalid Supabase anon key format');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('professores').select('count').limit(1);
    if (error) {
      console.error('Erro ao testar conexão Supabase:', error);
      return false;
    }
    console.log('✅ Conexão Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão Supabase:', error);
    return false;
  }
};

// Testar conexão ao inicializar (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  testConnection();
}