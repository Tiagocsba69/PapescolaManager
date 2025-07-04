/*
  # Adicionar tabela de logs de email

  1. Nova Tabela
    - `email_logs`
      - `id` (uuid, primary key)
      - `recipient` (text)
      - `subject` (text)
      - `type` (text)
      - `status` (text)
      - `sent_at` (timestamp)
      - `error_message` (text, nullable)
      - `created_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela
    - Política para permitir operações
*/

-- Criar tabela de logs de email
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text NOT NULL,
  type text NOT NULL CHECK (type IN ('professor_added', 'turma_created', 'contacto_registered', 'weekly_report')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Habilitar Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Política de segurança
CREATE POLICY "Permitir todas as operações em email_logs" 
  ON email_logs FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Comentário na tabela
COMMENT ON TABLE email_logs IS 'Logs de emails enviados pelo sistema';
COMMENT ON COLUMN email_logs.type IS 'Tipo de email: professor_added, turma_created, contacto_registered, weekly_report';
COMMENT ON COLUMN email_logs.status IS 'Status do envio: pending, sent, failed';