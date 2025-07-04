import { useState, useEffect } from 'react';
import { emailService } from '../services/emailService';
import { useAuth } from '../contexts/AuthContext';

interface NotificationSettings {
  emailNovoProfessor: boolean;
  emailNovaTurma: boolean;
  emailNovoContacto: boolean;
  relatoriosSemanais: boolean;
  emailRecipients: string[];
}

export const useEmailNotifications = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNovoProfessor: true,
    emailNovaTurma: true,
    emailNovoContacto: false,
    relatoriosSemanais: true,
    emailRecipients: []
  });

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('emailNotificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else if (user?.email) {
      // Configuração padrão com email do usuário
      setSettings(prev => ({
        ...prev,
        emailRecipients: [user.email]
      }));
    }
  }, [user]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('emailNotificationSettings', JSON.stringify(updatedSettings));
  };

  const notifyProfessorAdded = async (professorData: any) => {
    if (settings.emailNovoProfessor && settings.emailRecipients.length > 0) {
      await emailService.notifyProfessorAdded(professorData, settings.emailRecipients);
    }
  };

  const notifyTurmaCreated = async (turmaData: any) => {
    if (settings.emailNovaTurma && settings.emailRecipients.length > 0) {
      await emailService.notifyTurmaCreated(turmaData, settings.emailRecipients);
    }
  };

  const notifyContactoRegistered = async (contactoData: any) => {
    if (settings.emailNovoContacto && settings.emailRecipients.length > 0) {
      await emailService.notifyContactoRegistered(contactoData, settings.emailRecipients);
    }
  };

  const sendWeeklyReport = async (reportData: any) => {
    if (settings.relatoriosSemanais && settings.emailRecipients.length > 0) {
      await emailService.sendWeeklyReport(reportData, settings.emailRecipients);
    }
  };

  return {
    settings,
    updateSettings,
    notifyProfessorAdded,
    notifyTurmaCreated,
    notifyContactoRegistered,
    sendWeeklyReport
  };
};