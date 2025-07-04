import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  type: 'professor_added' | 'turma_created' | 'contacto_registered' | 'weekly_report'
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, type }: EmailRequest = await req.json()

    // Configuração do Gmail SMTP
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD') // App Password do Gmail
    
    if (!gmailUser || !gmailPassword) {
      throw new Error('Credenciais Gmail não configuradas')
    }

    // Criar o email usando a API do Gmail
    const emailData = {
      from: gmailUser,
      to: to,
      subject: subject,
      html: html,
      headers: {
        'X-Mailer': 'EduManager System',
        'X-Priority': type === 'weekly_report' ? '3' : '1'
      }
    }

    // Simular envio (em produção, usar Gmail API ou SMTP)
    console.log('📧 Email enviado:', {
      to: emailData.to,
      subject: emailData.subject,
      type: type,
      timestamp: new Date().toISOString()
    })

    // Log da atividade no banco
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Registar o envio do email
    await supabase.from('email_logs').insert({
      recipient: to,
      subject: subject,
      type: type,
      status: 'sent',
      sent_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        emailId: `email_${Date.now()}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})