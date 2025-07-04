import { supabase } from '../lib/supabase';

export interface EmailNotification {
  to: string;
  subject: string;
  type: 'professor_added' | 'turma_created' | 'contacto_registered' | 'weekly_report';
  data?: any;
}

class EmailService {
  private async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      const html = this.generateEmailHTML(notification.type, notification.data);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: notification.to,
          subject: notification.subject,
          html: html,
          type: notification.type
        }
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        return false;
      }

      console.log('✅ Email enviado com sucesso:', data);
      return true;
    } catch (error) {
      console.error('Erro no serviço de email:', error);
      return false;
    }
  }

  private generateEmailHTML(type: string, data: any): string {
    const baseStyle = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6, #10B981); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    `;

    switch (type) {
      case 'professor_added':
        return `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>🎓 Novo Professor Adicionado</h1>
            </div>
            <div class="content">
              <h2>Olá!</h2>
              <p>Um novo professor foi adicionado ao sistema EduManager:</p>
              <ul>
                <li><strong>Nome:</strong> ${data.nome}</li>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Departamento:</strong> ${data.departamento}</li>
                <li><strong>Cargo:</strong> ${data.cargo}</li>
              </ul>
              <a href="${window.location.origin}" class="button">Aceder ao Sistema</a>
            </div>
            <div class="footer">
              <p>EduManager - Sistema de Gestão Escolar</p>
            </div>
          </div>
        `;

      case 'turma_created':
        return `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>📚 Nova Turma Criada</h1>
            </div>
            <div class="content">
              <h2>Nova turma disponível!</h2>
              <p>Uma nova turma foi criada no sistema:</p>
              <ul>
                <li><strong>Curso:</strong> ${data.curso}</li>
                <li><strong>Código:</strong> ${data.cod_formacao}</li>
                <li><strong>Professor:</strong> ${data.professor}</li>
                <li><strong>Data de Início:</strong> ${new Date(data.data_inicio).toLocaleDateString('pt-PT')}</li>
              </ul>
              <a href="${window.location.origin}" class="button">Ver Detalhes</a>
            </div>
            <div class="footer">
              <p>EduManager - Sistema de Gestão Escolar</p>
            </div>
          </div>
        `;

      case 'contacto_registered':
        return `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>📞 Novo Contacto Registado</h1>
            </div>
            <div class="content">
              <h2>Contacto agendado!</h2>
              <p>Um novo contacto foi registado no sistema:</p>
              <ul>
                <li><strong>Motivo:</strong> ${data.motivo}</li>
                <li><strong>Entre:</strong> ${data.emissor} e ${data.receptor}</li>
                <li><strong>Data:</strong> ${new Date(data.data).toLocaleDateString('pt-PT')}</li>
                <li><strong>Hora:</strong> ${data.hora}</li>
              </ul>
              <a href="${window.location.origin}" class="button">Ver Contactos</a>
            </div>
            <div class="footer">
              <p>EduManager - Sistema de Gestão Escolar</p>
            </div>
          </div>
        `;

      case 'weekly_report':
        return `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>📊 Relatório Semanal</h1>
            </div>
            <div class="content">
              <h2>Resumo da Semana</h2>
              <p>Aqui está o resumo das atividades desta semana:</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #3B82F6; margin: 0;">${data.professores || 0}</h3>
                  <p style="margin: 5px 0;">Professores Ativos</p>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #10B981; margin: 0;">${data.turmas || 0}</h3>
                  <p style="margin: 5px 0;">Turmas Ativas</p>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <h3 style="color: #F59E0B; margin: 0;">${data.contactos || 0}</h3>
                  <p style="margin: 5px 0;">Contactos Esta Semana</p>
                </div>
              </div>
              <a href="${window.location.origin}" class="button">Ver Dashboard</a>
            </div>
            <div class="footer">
              <p>EduManager - Sistema de Gestão Escolar</p>
            </div>
          </div>
        `;

      default:
        return `
          ${baseStyle}
          <div class="container">
            <div class="header">
              <h1>📧 Notificação EduManager</h1>
            </div>
            <div class="content">
              <p>Você recebeu uma nova notificação do sistema EduManager.</p>
              <a href="${window.location.origin}" class="button">Aceder ao Sistema</a>
            </div>
            <div class="footer">
              <p>EduManager - Sistema de Gestão Escolar</p>
            </div>
          </div>
        `;
    }
  }

  // Métodos públicos para diferentes tipos de notificação
  async notifyProfessorAdded(professorData: any, recipients: string[]): Promise<void> {
    for (const email of recipients) {
      await this.sendEmail({
        to: email,
        subject: `🎓 Novo Professor: ${professorData.nome}`,
        type: 'professor_added',
        data: professorData
      });
    }
  }

  async notifyTurmaCreated(turmaData: any, recipients: string[]): Promise<void> {
    for (const email of recipients) {
      await this.sendEmail({
        to: email,
        subject: `📚 Nova Turma: ${turmaData.curso}`,
        type: 'turma_created',
        data: turmaData
      });
    }
  }

  async notifyContactoRegistered(contactoData: any, recipients: string[]): Promise<void> {
    for (const email of recipients) {
      await this.sendEmail({
        to: email,
        subject: `📞 Novo Contacto: ${contactoData.motivo}`,
        type: 'contacto_registered',
        data: contactoData
      });
    }
  }

  async sendWeeklyReport(reportData: any, recipients: string[]): Promise<void> {
    for (const email of recipients) {
      await this.sendEmail({
        to: email,
        subject: `📊 Relatório Semanal - ${new Date().toLocaleDateString('pt-PT')}`,
        type: 'weekly_report',
        data: reportData
      });
    }
  }
}

export const emailService = new EmailService();