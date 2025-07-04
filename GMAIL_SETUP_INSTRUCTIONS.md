# Configuração Gmail para Notificações - EduManager

## 📧 Configuração do Gmail para Envio de Emails

### Passo 1: Configurar Gmail App Password

1. **Ativar Autenticação de 2 Fatores**
   - Acesse [myaccount.google.com](https://myaccount.google.com)
   - Vá para "Segurança" → "Verificação em duas etapas"
   - Siga as instruções para ativar

2. **Gerar App Password**
   - Na mesma página de segurança, procure "Senhas de app"
   - Clique em "Senhas de app"
   - Selecione "App" → "Outro (nome personalizado)"
   - Digite "EduManager" como nome
   - Copie a senha gerada (16 caracteres)

### Passo 2: Configurar Variáveis no Supabase

1. **Acesse o Dashboard Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Abra seu projeto EduManager

2. **Configurar Edge Functions**
   - Vá para "Edge Functions" no menu lateral
   - Clique em "Settings" ou "Environment Variables"
   - Adicione as seguintes variáveis:

   ```
   GMAIL_USER=seu-email@gmail.com
   GMAIL_APP_PASSWORD=sua-senha-de-app-16-caracteres
   ```

### Passo 3: Deploy da Edge Function

1. **Instalar Supabase CLI** (se ainda não tiver)
   ```bash
   npm install -g supabase
   ```

2. **Login no Supabase**
   ```bash
   supabase login
   ```

3. **Deploy da Function**
   ```bash
   supabase functions deploy send-email
   ```

### Passo 4: Testar o Sistema

1. **No EduManager**
   - Vá para "Configurações" → "Notificações"
   - Adicione seu email na lista de destinatários
   - Ative as notificações desejadas
   - Clique em "Enviar Teste"

2. **Verificar Gmail**
   - Verifique sua caixa de entrada
   - Verifique também a pasta de spam

## 🔧 Funcionalidades Implementadas

### Tipos de Notificação

1. **Novo Professor Adicionado**
   - Enviado quando um professor é criado
   - Inclui dados do professor

2. **Nova Turma Criada**
   - Enviado quando uma turma é criada
   - Inclui detalhes da turma

3. **Novo Contacto Registado**
   - Enviado quando um contacto é agendado
   - Inclui informações do contacto

4. **Relatório Semanal**
   - Enviado automaticamente (se configurado)
   - Resumo das atividades da semana

### Configurações Disponíveis

- ✅ Ativar/desativar cada tipo de notificação
- ✅ Múltiplos destinatários de email
- ✅ Teste de envio de email
- ✅ Log de emails enviados
- ✅ Templates HTML responsivos

## 🎨 Templates de Email

Os emails são enviados com templates HTML profissionais que incluem:

- **Design Responsivo**: Funciona em desktop e mobile
- **Branding EduManager**: Logo e cores consistentes
- **Informações Detalhadas**: Dados relevantes de cada notificação
- **Call-to-Action**: Botões para aceder ao sistema
- **Footer Informativo**: Identificação do sistema

## 🔍 Monitorização

### Logs de Email

O sistema mantém logs de todos os emails enviados:
- Destinatário
- Assunto
- Tipo de notificação
- Status (enviado/falhado)
- Data/hora de envio
- Mensagens de erro (se aplicável)

### Verificação de Status

Para verificar se os emails estão a ser enviados:

1. **No Supabase Dashboard**
   - Vá para "Table Editor"
   - Abra a tabela `email_logs`
   - Verifique os registos recentes

2. **No Browser Console**
   - Abra as ferramentas de desenvolvedor
   - Verifique a aba "Console" para logs

## ❗ Resolução de Problemas

### Email não enviado

1. **Verificar Credenciais**
   - Confirme que GMAIL_USER e GMAIL_APP_PASSWORD estão corretos
   - Teste a senha de app noutro cliente de email

2. **Verificar Edge Function**
   - Vá para "Edge Functions" → "Logs" no Supabase
   - Procure por erros na function `send-email`

3. **Verificar Configurações Gmail**
   - Confirme que a autenticação de 2 fatores está ativa
   - Regenere a senha de app se necessário

### Emails na pasta de spam

1. **Configurar SPF/DKIM** (avançado)
   - Para produção, configure registos DNS apropriados
   - Use um serviço de email profissional (SendGrid, Mailgun)

2. **Testar com diferentes emails**
   - Teste com Gmail, Outlook, etc.
   - Verifique se o problema é específico de um provedor

## 🚀 Próximos Passos

Para um ambiente de produção, considere:

1. **Serviço de Email Profissional**
   - SendGrid, Mailgun, ou Amazon SES
   - Melhor deliverability
   - Métricas avançadas

2. **Templates Avançados**
   - Editor de templates
   - Personalização por utilizador
   - Múltiplos idiomas

3. **Agendamento de Emails**
   - Relatórios automáticos
   - Lembretes de contactos
   - Notificações de aniversários

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Supabase
2. Teste as credenciais Gmail
3. Confirme que as variáveis de ambiente estão definidas
4. Verifique se a Edge Function foi deployada corretamente

---

**Nota**: Esta configuração é para desenvolvimento/teste. Para produção, recomenda-se usar um serviço de email profissional.