# Configuração Supabase - EduManager

## Passos para configurar o Supabase

### 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Escolha uma organização
5. Configure o projeto:
   - **Name**: EduManager
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima (ex: Europe West)
6. Clique em **"Create new project"**

### 2. Obter Credenciais

1. No dashboard do projeto, vá para **Settings** → **API**
2. Copie os seguintes valores:
   - **Project URL** (ex: https://xyzabc123.supabase.co)
   - **anon public** key (chave longa que começa com eyJ...)

### 3. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

### 4. Executar Migrações do Banco de Dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase/migrations/create_complete_schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** para executar

### 5. Verificar Configuração

1. Vá para **Table Editor** no dashboard
2. Você deve ver as tabelas:
   - `professores`
   - `turmas`
   - `contactos`
3. Cada tabela deve ter dados de exemplo

### 6. Configurar Autenticação (Opcional)

1. Vá para **Authentication** → **Settings**
2. Configure:
   - **Site URL**: http://localhost:5173 (para desenvolvimento)
   - **Redirect URLs**: http://localhost:5173/**
3. Desabilite **"Enable email confirmations"** para desenvolvimento

### 7. Testar Conexão

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Acesse http://localhost:5173
3. Tente fazer login ou criar uma conta
4. Navegue pelas seções de Professores, Turmas e Contactos

## Estrutura do Banco de Dados

### Tabelas Principais

- **professores**: Gestão de professores
- **turmas**: Gestão de turmas/cursos
- **contactos**: Registo de contactos entre professores

### Funcionalidades

- ✅ Autenticação de utilizadores
- ✅ CRUD completo para todas as entidades
- ✅ Relacionamentos entre tabelas
- ✅ Validações e constraints
- ✅ Índices para performance
- ✅ Row Level Security (RLS)
- ✅ Triggers para updated_at automático
- ✅ Dados de exemplo

### Políticas de Segurança

Atualmente configurado para desenvolvimento com acesso público.
**IMPORTANTE**: Para produção, implemente políticas RLS mais restritivas.

## Resolução de Problemas

### Erro "Invalid login credentials"
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que executou as migrações
- Tente criar uma nova conta primeiro

### Erro de conexão
- Verifique a URL do projeto
- Verifique a chave anon
- Certifique-se de que o projeto Supabase está ativo

### Tabelas não aparecem
- Execute novamente o script SQL completo
- Verifique se não há erros no SQL Editor
- Recarregue a página do Table Editor