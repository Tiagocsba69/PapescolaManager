import React from 'react';
import { Users, GraduationCap, Phone, TrendingUp } from 'lucide-react';
import { Professor, Turma, Contacto } from '../types';

interface DashboardProps {
  professores: Professor[];
  turmas: Turma[];
  contactos: Contacto[];
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ professores, turmas, contactos, onNavigate }) => {
  const stats = [
    {
      title: 'Total Professores',
      value: professores.length.toString(),
      icon: Users,
      color: 'bg-blue-600',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Turmas Ativas',
      value: turmas.filter(t => t.status === 'ativa').length.toString(),
      icon: GraduationCap,
      color: 'bg-emerald-600',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Contactos Hoje',
      value: contactos.filter(c => c.data === new Date().toISOString().split('T')[0]).length.toString(),
      icon: Phone,
      color: 'bg-orange-600',
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Taxa de Crescimento',
      value: '8.2%',
      icon: TrendingUp,
      color: 'bg-purple-600',
      change: '+2.1%',
      changeType: 'positive' as const
    }
  ];

  const getRecentActivities = () => {
    const activities = [];
    
    // Últimos professores adicionados
    const recentProfessores = professores.slice(-2);
    recentProfessores.forEach(prof => {
      activities.push({
        id: `prof-${prof.id}`,
        type: 'professor',
        message: `Novo professor adicionado: ${prof.nome}`,
        time: '2 horas atrás',
        color: 'bg-blue-100 text-blue-800'
      });
    });

    // Últimas turmas criadas
    const recentTurmas = turmas.slice(-2);
    recentTurmas.forEach(turma => {
      activities.push({
        id: `turma-${turma.id}`,
        type: 'turma',
        message: `Turma "${turma.curso}" criada`,
        time: '4 horas atrás',
        color: 'bg-emerald-100 text-emerald-800'
      });
    });

    // Últimos contactos
    const recentContactos = contactos.slice(-2);
    recentContactos.forEach(contacto => {
      activities.push({
        id: `contacto-${contacto.id}`,
        type: 'contacto',
        message: `Contacto registado: ${contacto.motivo}`,
        time: '6 horas atrás',
        color: 'bg-orange-100 text-orange-800'
      });
    });

    return activities.slice(0, 4);
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                    {activity.type}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('professores')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Adicionar Professor</span>
            </button>
            <button 
              onClick={() => onNavigate('turmas')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Criar Turma</span>
            </button>
            <button 
              onClick={() => onNavigate('contactos')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Registar Contacto</span>
            </button>
          </div>
          
          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Estado do Sistema</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de Dados</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Servidor</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup</span>
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;