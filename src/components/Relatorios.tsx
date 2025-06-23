import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Users, GraduationCap, Phone, TrendingUp, FileText, Filter } from 'lucide-react';
import { Professor, Turma, Contacto } from '../types';

interface RelatoriosProps {
  professores: Professor[];
  turmas: Turma[];
  contactos: Contacto[];
}

const Relatorios: React.FC<RelatoriosProps> = ({ professores, turmas, contactos }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedReport, setSelectedReport] = useState('geral');

  // Estatísticas gerais
  const stats = {
    totalProfessores: professores.length,
    professoresAtivos: professores.filter(p => p.status === 'ativo').length,
    turmasAtivas: turmas.filter(t => t.status === 'ativa').length,
    totalAlunos: turmas.reduce((sum, t) => sum + t.total_alunos, 0),
    contactosHoje: contactos.filter(c => c.data === new Date().toISOString().split('T')[0]).length,
    contactosConcluidos: contactos.filter(c => c.estado === 'concluido').length,
  };

  // Dados por departamento
  const departamentos = professores.reduce((acc, prof) => {
    acc[prof.departamento] = (acc[prof.departamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados de contactos por estado
  const contactosPorEstado = contactos.reduce((acc, contacto) => {
    acc[contacto.estado] = (acc[contacto.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleDownloadReport = (reportType: string) => {
    // Simular download de relatório
    const data = {
      tipo: reportType,
      periodo: selectedPeriod,
      gerado_em: new Date().toISOString(),
      estatisticas: stats,
      departamentos,
      contactos_por_estado: contactosPorEstado,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reportTypes = [
    { id: 'geral', name: 'Relatório Geral', icon: BarChart3 },
    { id: 'professores', name: 'Relatório de Professores', icon: Users },
    { id: 'turmas', name: 'Relatório de Turmas', icon: GraduationCap },
    { id: 'contactos', name: 'Relatório de Contactos', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-600">Análise detalhada dos dados do sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mês</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="ano">Último Ano</option>
          </select>
          <button
            onClick={() => handleDownloadReport(selectedReport)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Professores</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProfessores}</p>
              <p className="text-sm text-emerald-600 mt-1">
                {stats.professoresAtivos} ativos
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Turmas Ativas</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.turmasAtivas}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalAlunos} alunos
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contactos Hoje</p>
              <p className="text-3xl font-bold text-orange-600">{stats.contactosHoje}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.contactosConcluidos} concluídos
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Phone className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Crescimento</p>
              <p className="text-3xl font-bold text-purple-600">+12.5%</p>
              <p className="text-sm text-emerald-600 mt-1">
                vs. período anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedReport === report.id
                  ? 'border-purple-500 ring-2 ring-purple-200'
                  : 'border-gray-100'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">Clique para selecionar</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professores por Departamento */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professores por Departamento</h3>
          <div className="space-y-4">
            {Object.entries(departamentos).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{dept}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalProfessores) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contactos por Estado */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactos por Estado</h3>
          <div className="space-y-4">
            {Object.entries(contactosPorEstado).map(([estado, count]) => {
              const colors = {
                pendente: 'bg-yellow-500',
                em_progresso: 'bg-blue-500',
                concluido: 'bg-emerald-500',
                cancelado: 'bg-red-500',
              };
              return (
                <div key={estado} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors[estado as keyof typeof colors]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">{estado.replace('_', ' ')}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Relatório Detalhado */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Relatório Detalhado</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Período: {selectedPeriod}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Resumo Executivo</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• {stats.totalProfessores} professores registados</li>
              <li>• {stats.turmasAtivas} turmas em funcionamento</li>
              <li>• {stats.totalAlunos} alunos matriculados</li>
              <li>• {contactos.length} contactos registados</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Indicadores de Performance</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Taxa de ocupação: 85%</li>
              <li>• Satisfação: 4.2/5</li>
              <li>• Eficiência: 92%</li>
              <li>• Crescimento: +12.5%</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recomendações</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Contratar mais professores</li>
              <li>• Expandir departamentos</li>
              <li>• Melhorar comunicação</li>
              <li>• Investir em tecnologia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;