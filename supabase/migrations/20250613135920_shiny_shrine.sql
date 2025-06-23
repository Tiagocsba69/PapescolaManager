/*
  # Schema de Gestão Escolar

  1. Novas Tabelas
    - `professores`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `telefone` (text)
      - `email` (text, unique)
      - `cargo` (text)
      - `departamento` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `turmas`
      - `id` (uuid, primary key)
      - `curso` (text)
      - `ano` (text)
      - `cod_formacao` (text, unique)
      - `professor_id` (uuid, foreign key)
      - `total_alunos` (integer)
      - `status` (text)
      - `data_inicio` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contactos`
      - `id` (uuid, primary key)
      - `emissor_id` (uuid, foreign key)
      - `receptor_id` (uuid, foreign key)
      - `motivo` (text)
      - `estado` (text)
      - `data` (date)
      - `hora` (time)
      - `duracao` (integer)
      - `notas` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para operações CRUD
*/

-- Criar tabela de professores
CREATE TABLE IF NOT EXISTS professores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  email text UNIQUE NOT NULL,
  cargo text NOT NULL,
  departamento text NOT NULL,
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de turmas
CREATE TABLE IF NOT EXISTS turmas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso text NOT NULL,
  ano text NOT NULL,
  cod_formacao text UNIQUE NOT NULL,
  professor_id uuid REFERENCES professores(id) ON DELETE SET NULL,
  total_alunos integer DEFAULT 0 CHECK (total_alunos >= 0),
  status text DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'suspensa')),
  data_inicio date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de contactos
CREATE TABLE IF NOT EXISTS contactos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emissor_id uuid REFERENCES professores(id) ON DELETE CASCADE,
  receptor_id uuid REFERENCES professores(id) ON DELETE CASCADE,
  motivo text NOT NULL,
  estado text DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_progresso', 'concluido', 'cancelado')),
  data date NOT NULL,
  hora time NOT NULL,
  duracao integer CHECK (duracao >= 0),
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_professores_email ON professores(email);
CREATE INDEX IF NOT EXISTS idx_professores_status ON professores(status);
CREATE INDEX IF NOT EXISTS idx_turmas_professor_id ON turmas(professor_id);
CREATE INDEX IF NOT EXISTS idx_turmas_status ON turmas(status);
CREATE INDEX IF NOT EXISTS idx_contactos_emissor_id ON contactos(emissor_id);
CREATE INDEX IF NOT EXISTS idx_contactos_receptor_id ON contactos(receptor_id);
CREATE INDEX IF NOT EXISTS idx_contactos_data ON contactos(data);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_professores_updated_at BEFORE UPDATE ON professores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turmas_updated_at BEFORE UPDATE ON turmas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contactos_updated_at BEFORE UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permitir todas as operações por enquanto)
CREATE POLICY "Permitir todas as operações em professores" ON professores FOR ALL USING (true);
CREATE POLICY "Permitir todas as operações em turmas" ON turmas FOR ALL USING (true);
CREATE POLICY "Permitir todas as operações em contactos" ON contactos FOR ALL USING (true);

-- Inserir dados iniciais
INSERT INTO professores (nome, telefone, email, cargo, departamento, status) VALUES
('Dr. João Silva', '+351 21 123 4567', 'joao.silva@escola.com', 'Professor Catedrático', 'Matemática', 'ativo'),
('Dra. Maria Santos', '+351 91 543 2109', 'maria.santos@escola.com', 'Professor Associado', 'Física', 'ativo'),
('Prof. Carlos Oliveira', '+351 96 123 4567', 'carlos.oliveira@escola.com', 'Professor Auxiliar', 'Química', 'inativo'),
('Dra. Ana Costa', '+351 93 678 9012', 'ana.costa@escola.com', 'Professor Catedrático', 'Biologia', 'ativo')
ON CONFLICT (email) DO NOTHING;

-- Inserir turmas iniciais (usando subqueries para obter os IDs dos professores)
INSERT INTO turmas (curso, ano, cod_formacao, professor_id, total_alunos, status, data_inicio) VALUES
('Matemática Avançada', '2024', 'MAT2024-001', (SELECT id FROM professores WHERE email = 'joao.silva@escola.com'), 28, 'ativa', '2024-02-15'),
('Física Quântica', '2024', 'FIS2024-002', (SELECT id FROM professores WHERE email = 'maria.santos@escola.com'), 22, 'ativa', '2024-03-01'),
('Química Orgânica', '2023', 'QUI2023-015', (SELECT id FROM professores WHERE email = 'carlos.oliveira@escola.com'), 31, 'concluida', '2023-08-20'),
('Biologia Molecular', '2024', 'BIO2024-003', (SELECT id FROM professores WHERE email = 'ana.costa@escola.com'), 25, 'ativa', '2024-01-30')
ON CONFLICT (cod_formacao) DO NOTHING;

-- Inserir contactos iniciais
INSERT INTO contactos (emissor_id, receptor_id, motivo, estado, data, hora, duracao, notas) VALUES
(
  (SELECT id FROM professores WHERE email = 'joao.silva@escola.com'),
  (SELECT id FROM professores WHERE email = 'maria.santos@escola.com'),
  'Reunião sobre programa curricular',
  'concluido',
  '2024-01-15',
  '14:30',
  45,
  'Discutido alterações ao programa de matemática'
),
(
  (SELECT id FROM professores WHERE email = 'ana.costa@escola.com'),
  (SELECT id FROM professores WHERE email = 'carlos.oliveira@escola.com'),
  'Coordenação de projeto de pesquisa',
  'em_progresso',
  '2024-01-16',
  '10:00',
  30,
  NULL
),
(
  (SELECT id FROM professores WHERE email = 'carlos.oliveira@escola.com'),
  (SELECT id FROM professores WHERE email = 'joao.silva@escola.com'),
  'Discussão sobre recursos laboratoriais',
  'pendente',
  '2024-01-17',
  '15:00',
  NULL,
  NULL
),
(
  (SELECT id FROM professores WHERE email = 'maria.santos@escola.com'),
  (SELECT id FROM professores WHERE email = 'ana.costa@escola.com'),
  'Avaliação de desempenho estudantil',
  'concluido',
  '2024-01-14',
  '09:15',
  60,
  'Analisados resultados do último trimestre'
);