export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      professores: {
        Row: {
          id: string
          nome: string
          telefone: string
          email: string
          cargo: string
          departamento: string
          status: 'ativo' | 'inativo'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          telefone: string
          email: string
          cargo: string
          departamento: string
          status?: 'ativo' | 'inativo'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          telefone?: string
          email?: string
          cargo?: string
          departamento?: string
          status?: 'ativo' | 'inativo'
          created_at?: string
          updated_at?: string
        }
      }
      turmas: {
        Row: {
          id: string
          curso: string
          ano: string
          cod_formacao: string
          professor_id: string | null
          total_alunos: number
          status: 'ativa' | 'concluida' | 'suspensa'
          data_inicio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          curso: string
          ano: string
          cod_formacao: string
          professor_id?: string | null
          total_alunos?: number
          status?: 'ativa' | 'concluida' | 'suspensa'
          data_inicio: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          curso?: string
          ano?: string
          cod_formacao?: string
          professor_id?: string | null
          total_alunos?: number
          status?: 'ativa' | 'concluida' | 'suspensa'
          data_inicio?: string
          created_at?: string
          updated_at?: string
        }
      }
      contactos: {
        Row: {
          id: string
          emissor_id: string | null
          receptor_id: string | null
          motivo: string
          estado: 'pendente' | 'em_progresso' | 'concluido' | 'cancelado'
          data: string
          hora: string
          duracao: number | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          emissor_id?: string | null
          receptor_id?: string | null
          motivo: string
          estado?: 'pendente' | 'em_progresso' | 'concluido' | 'cancelado'
          data: string
          hora: string
          duracao?: number | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          emissor_id?: string | null
          receptor_id?: string | null
          motivo?: string
          estado?: 'pendente' | 'em_progresso' | 'concluido' | 'cancelado'
          data?: string
          hora?: string
          duracao?: number | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}