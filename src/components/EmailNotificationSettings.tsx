import React, { useState } from 'react';
import { Mail, Plus, Trash2, Save, Bell, Users } from 'lucide-react';
import { useEmailNotifications } from '../hooks/useEmailNotifications';

const EmailNotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useEmailNotifications();
  const [newEmail, setNewEmail] = useState('');
  const [testEmailSent, setTestEmailSent] = useState(false);

  const handleAddEmail = () => {
    if (newEmail && !settings.emailRecipients.includes(newEmail)) {
      updateSettings({
        emailRecipients: [...settings.emailRecipients, newEmail]
      });
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    updateSettings({
      emailRecipients: settings.emailRecipients.filter(e => e !== email)
    });
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const sendTestEmail = async () => {
    try {
      const { emailService } = await import('../services/emailService');
      await emailService.notifyProfessorAdded(
        {
          nome: 'Professor Teste',
          email: 'teste@exemplo.com',
          departamento: 'Teste',
          cargo: 'Professor de Teste'
        },
        settings.emailRecipients
      );
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notificações por Email</h3>
            <p className="text-sm text-gray-600">Configure quando receber emails do sistema</p>
          </div>
        </div>

        {/* Configurações de Notificação */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Novo Professor Adicionado</p>
                <p className="text-sm text-gray-600">Receber email quando um professor for adicionado</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNovoProfessor}
                onChange={(e) => handleSettingChange('emailNovoProfessor', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Nova Turma Criada</p>
                <p className="text-sm text-gray-600">Receber email quando uma turma for criada</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNovaTurma}
                onChange={(e) => handleSettingChange('emailNovaTurma', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Novo Contacto Registado</p>
                <p className="text-sm text-gray-600">Receber email quando um contacto for registado</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNovoContacto}
                onChange={(e) => handleSettingChange('emailNovoContacto', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Relatórios Semanais</p>
                <p className="text-sm text-gray-600">Receber relatório semanal por email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.relatoriosSemanais}
                onChange={(e) => handleSettingChange('relatoriosSemanais', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Lista de Emails */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Destinatários de Email</h4>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="adicionar@email.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          </div>

          <div className="space-y-2">
            {settings.emailRecipients.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{email}</span>
                </div>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {settings.emailRecipients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Nenhum email configurado</p>
              <p className="text-sm">Adicione emails para receber notificações</p>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={sendTestEmail}
            disabled={settings.emailRecipients.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Enviar Teste</span>
          </button>

          {testEmailSent && (
            <div className="text-green-600 text-sm flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Email de teste enviado!</span>
            </div>
          )}
        </div>
      </div>

      {/* Instruções de Configuração */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📧 Configuração Gmail</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>Para ativar as notificações por email:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Configure as variáveis de ambiente no Supabase</li>
            <li>GMAIL_USER: seu email Gmail</li>
            <li>GMAIL_APP_PASSWORD: senha de app do Gmail</li>
            <li>Ative a autenticação de 2 fatores no Gmail</li>
            <li>Gere uma senha de app específica</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EmailNotificationSettings;