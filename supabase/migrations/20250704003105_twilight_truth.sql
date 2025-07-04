/*
  # Schema Completo de Gestão Escolar - EduManager

  1. Novas Tabelas
    - `professores`
      - `id` (uuid, primary key)
      - `nome` (text, obrigatório)
      - `telefone` (text, obrigatório)
      - `email` (text, único, obrigatório)
      - `cargo` (text, obrigatório)
      - `departamento` (text, obrigatório)
      - `status` (text, padrão 'ativo')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `turmas`
      - `id` (uuid, primary key)
      - `curso` (text, obrigatório)
      - `ano` (text, obrigatório)
      - `cod_formacao` (text, único, obrigatório)
      - `professor_id` (uuid, foreign key)
      - `total_alunos` (integer, padrão 0)
      - `status` (text, padrão 'ativa')
      - `data_inicio` (date, obrigatório)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contactos`
      - `id` (uuid, primary key)
      - `emissor_id` (uuid, foreign key)
      - `receptor_id` (uuid, foreign key)
      - `motivo` (text, obrigatório)
      - `estado` (text, padrão 'pendente')
      - `data` (date, obrigatório)
      - `hora` (time, obrigatório)
      - `duracao` (integer, opcional)
      - `notas` (text, opcional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para operações CRUD públicas (para desenvolvimento)
    - Índices para performance

  3. Dados Iniciais
    - Professores de exemplo
    - Turmas de exemplo
    - Contactos de exemplo
*/

-- Limpar tabelas existentes se existirem
DROP TABLE IF EXISTS contactos CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;
DROP TABLE IF EXISTS professores CASCADE;

-- Remover função se existir
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar tabela de professores
CREATE TABLE professores (
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
CREATE TABLE turmas (
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
CREATE TABLE contactos (
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
CREATE INDEX idx_professores_email ON professores(email);
CREATE INDEX idx_professores_status ON professores(status);
CREATE INDEX idx_professores_departamento ON professores(departamento);

CREATE INDEX idx_turmas_professor_id ON turmas(professor_id);
CREATE INDEX idx_turmas_status ON turmas(status);
CREATE INDEX idx_turmas_ano ON turmas(ano);
CREATE INDEX idx_turmas_cod_formacao ON turmas(cod_formacao);

CREATE INDEX idx_contactos_emissor_id ON contactos(emissor_id);
CREATE INDEX idx_contactos_receptor_id ON contactos(receptor_id);
CREATE INDEX idx_contactos_data ON contactos(data);
CREATE INDEX idx_contactos_estado ON contactos(estado);

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_professores_updated_at 
  BEFORE UPDATE ON professores 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_turmas_updated_at 
  BEFORE UPDATE ON turmas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contactos_updated_at 
  BEFORE UPDATE ON contactos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permitir todas as operações para desenvolvimento)
-- IMPORTANTE: Em produção, estas políticas devem ser mais restritivas
CREATE POLICY "Permitir todas as operações em professores" 
  ON professores FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em turmas" 
  ON turmas FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em contactos" 
  ON contactos FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Inserir dados iniciais de professores
INSERT INTO professores (nome, telefone, email, cargo, departamento, status) VALUES
('Dr. João Silva', '+351 21 123 4567', 'joao.silva@escola.com', 'Professor Catedrático', 'Matemática', 'ativo'),
('Dra. Maria Santos', '+351 91 543 2109', 'maria.santos@escola.com', 'Professor Associado', 'Física', 'ativo'),
('Prof. Carlos Oliveira', '+351 96 123 4567', 'carlos.oliveira@escola.com', 'Professor Auxiliar', 'Química', 'inativo'),
('Dra. Ana Costa', '+351 93 678 9012', 'ana.costa@escola.com', 'Professor Catedrático', 'Biologia', 'ativo'),
('Prof. Pedro Martins', '+351 92 456 7890', 'pedro.martins@escola.com', 'Professor Associado', 'História', 'ativo'),
('Dra. Sofia Rodrigues', '+351 91 234 5678', 'sofia.rodrigues@escola.com', 'Professor Auxiliar', 'Geografia', 'ativo');

-- Inserir dados iniciais de turmas
INSERT INTO turmas (curso, ano, cod_formacao, professor_id, total_alunos, status, data_inicio) VALUES
('Matemática Avançada', '2024', 'MAT2024-001', 
  (SELECT id FROM professores WHERE email = 'joao.silva@escola.com'), 
  28, 'ativa', '2024-02-15'),
('Física Quântica', '2024', 'FIS2024-002', 
  (SELECT id FROM professores WHERE email = 'maria.santos@escola.com'), 
  22, 'ativa', '2024-03-01'),
('Química Orgânica', '2023', 'QUI2023-015', 
  (SELECT id FROM professores WHERE email = 'carlos.oliveira@escola.com'), 
  31, 'concluida', '2023-08-20'),
('Biologia Molecular', '2024', 'BIO2024-003', 
  (SELECT id FROM professores WHERE email = 'ana.costa@escola.com'), 
  25, 'ativa', '2024-01-30'),
('História Contemporânea', '2024', 'HIS2024-004', 
  (SELECT id FROM professores WHERE email = 'pedro.martins@escola.com'), 
  30, 'ativa', '2024-02-01'),
('Geografia Física', '2024', 'GEO2024-005', 
  (SELECT id FROM professores WHERE email = 'sofia.rodrigues@escola.com'), 
  26, 'ativa', '2024-02-10');

-- Inserir dados iniciais de contactos
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
  'Projeto sobre sustentabilidade ambiental'
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
),
(
  (SELECT id FROM professores WHERE email = 'pedro.martins@escola.com'),
  (SELECT id FROM professores WHERE email = 'sofia.rodrigues@escola.com'),
  'Planeamento de atividade interdisciplinar',
  'pendente',
  '2024-01-18',
  '11:00',
  NULL,
  NULL
),
(
  (SELECT id FROM professores WHERE email = 'sofia.rodrigues@escola.com'),
  (SELECT id FROM professores WHERE email = 'joao.silva@escola.com'),
  'Discussão sobre metodologias de ensino',
  'em_progresso',
  '2024-01-16',
  '16:30',
  40,
  'Explorar novas abordagens pedagógicas'
);

-- Criar views úteis para relatórios
CREATE OR REPLACE VIEW view_turmas_com_professores AS
SELECT 
  t.*,
  p.nome as professor_nome,
  p.departamento as professor_departamento
FROM turmas t
LEFT JOIN professores p ON t.professor_id = p.id;

CREATE OR REPLACE VIEW view_contactos_com_nomes AS
SELECT 
  c.*,
  pe.nome as emissor_nome,
  pr.nome as receptor_nome,
  pe.departamento as emissor_departamento,
  pr.departamento as receptor_departamento
FROM contactos c
LEFT JOIN professores pe ON c.emissor_id = pe.id
LEFT JOIN professores pr ON c.receptor_id = pr.id;

-- Comentários nas tabelas para documentação
COMMENT ON TABLE professores IS 'Tabela de professores da instituição';
COMMENT ON TABLE turmas IS 'Tabela de turmas/cursos oferecidos';
COMMENT ON TABLE contactos IS 'Tabela de registos de contactos entre professores';

COMMENT ON COLUMN professores.status IS 'Status do professor: ativo ou inativo';
COMMENT ON COLUMN turmas.status IS 'Status da turma: ativa, concluida ou suspensa';
COMMENT ON COLUMN contactos.estado IS 'Estado do contacto: pendente, em_progresso, concluido ou cancelado';