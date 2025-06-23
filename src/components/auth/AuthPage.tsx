import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onToggleMode={() => setMode('register')}
            onForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onToggleMode={() => setMode('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={() => setMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">EduManager</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sistema completo de gestão escolar para professores, turmas e contactos
            </p>
            <div className="grid grid-cols-1 gap-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Gestão de professores</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-gray-700">Organização de turmas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-gray-700">Registo de contactos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Relatórios detalhados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {renderForm()}
          </div>
        </div>
      </div>

      {/* Mobile Branding */}
      <div className="lg:hidden fixed top-4 left-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">EduManager</span>
      </div>
    </div>
  );
};

export default AuthPage;