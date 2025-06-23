export interface Professor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cargo: string;
  departamento: string;
  status: 'ativo' | 'inativo';
  created_at?: string;
  updated_at?: string;
}

export interface Turma {
  id: string;
  curso: string;
  ano: string;
  cod_formacao: string;
  professor_id: string | null;
  professor?: string; // Nome do professor (para exibição)
  total_alunos: number;
  status: 'ativa' | 'concluida' | 'suspensa';
  data_inicio: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contacto {
  id: string;
  emissor_id: string | null;
  receptor_id: string | null;
  emissor?: string; // Nome do emissor (para exibição)
  receptor?: string; // Nome do receptor (para exibição)
  motivo: string;
  estado: 'pendente' | 'em_progresso' | 'concluido' | 'cancelado';
  data: string;
  hora: string;
  duracao?: number | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}