import { Professor, Turma, Contacto } from '../../types';

export const mockProfessores: Professor[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    telefone: '+351 21 123 4567',
    email: 'joao.silva@escola.com',
    cargo: 'Professor Catedrático',
    departamento: 'Matemática',
    status: 'ativo',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    telefone: '+351 91 543 2109',
    email: 'maria.santos@escola.com',
    cargo: 'Professor Associado',
    departamento: 'Física',
    status: 'ativo',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockTurmas: Turma[] = [
  {
    id: '1',
    curso: 'Matemática Avançada',
    ano: '2024',
    cod_formacao: 'MAT2024-001',
    professor_id: '1',
    professor: 'Dr. João Silva',
    total_alunos: 28,
    status: 'ativa',
    data_inicio: '2024-02-15',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockContactos: Contacto[] = [
  {
    id: '1',
    emissor_id: '1',
    receptor_id: '2',
    emissor: 'Dr. João Silva',
    receptor: 'Dra. Maria Santos',
    motivo: 'Reunião sobre programa curricular',
    estado: 'concluido',
    data: '2024-01-15',
    hora: '14:30',
    duracao: 45,
    notas: 'Discutido alterações ao programa de matemática',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];