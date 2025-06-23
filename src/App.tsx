import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Professores from './components/Professores';
import Turmas from './components/Turmas';
import Contactos from './components/Contactos';
import { Professor, Turma, Contacto } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const initialProfessores: Professor[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@escola.com',
    cargo: 'Professor Titular',
    departamento: 'Matemática',
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    telefone: '(11) 95432-1098',
    email: 'maria.santos@escola.com',
    cargo: 'Professor Adjunto',
    departamento: 'Física',
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Prof. Carlos Oliveira',
    telefone: '(11) 91234-5678',
    email: 'carlos.oliveira@escola.com',
    cargo: 'Professor Assistente',
    departamento: 'Química',
    status: 'inativo'
  },
  {
    id: '4',
    nome: 'Dra. Ana Costa',
    telefone: '(11) 96789-0123',
    email: 'ana.costa@escola.com',
    cargo: 'Professor Titular',
    departamento: 'Biologia',
    status: 'ativo'
  }
];

const initialTurmas: Turma[] = [
  {
    id: '1',
    curso: 'Matemática Avançada',
    ano: '2024',
    cod_formacao: 'MAT2024-001',
    professor: 'Dr. João Silva',
    professor_id: '1',
    total_alunos: 28,
    status: 'ativa',
    data_inicio: '2024-02-15'
  },
  {
    id: '2',
    curso: 'Física Quântica',
    ano: '2024',
    cod_formacao: 'FIS2024-002',
    professor: 'Dra. Maria Santos',
    professor_id: '2',
    total_alunos: 22,
    status: 'ativa',
    data_inicio: '2024-03-01'
  },
  {
    id: '3',
    curso: 'Química Orgânica',
    ano: '2023',
    cod_formacao: 'QUI2023-015',
    professor: 'Prof. Carlos Oliveira',
    professor_id: '3',
    total_alunos: 31,
    status: 'concluida',
    data_inicio: '2023-08-20'
  },
  {
    id: '4',
    curso: 'Biologia Molecular',
    ano: '2024',
    cod_formacao: 'BIO2024-003',
    professor: 'Dra. Ana Costa',
    professor_id: '4',
    total_alunos: 25,
    status: 'ativa',
    data_inicio: '2024-01-30'
  }
];

const initialContactos: Contacto[] = [
  {
    id: '1',
    emissor: 'Dr. João Silva',
    receptor: 'Dra. Maria Santos',
    motivo: 'Reunião sobre programa curricular',
    estado: 'concluido',
    data: '2024-01-15',
    hora: '14:30',
    duracao: 45,
    notas: 'Discutido alterações ao programa de matemática',
    emissor_id: '1',
    receptor_id: '2'
  },
  {
    id: '2',
    emissor: 'Dra. Ana Costa',
    receptor: 'Prof. Carlos Oliveira',
    motivo: 'Coordenação de projeto de pesquisa',
    estado: 'em_progresso',
    data: '2024-01-16',
    hora: '10:00',
    duracao: 30,
    emissor_id: '4',
    receptor_id: '3'
  },
  {
    id: '3',
    emissor: 'Prof. Carlos Oliveira',
    receptor: 'Dr. João Silva',
    motivo: 'Discussão sobre recursos laboratoriais',
    estado: 'pendente',
    data: '2024-01-17',
    hora: '15:00',
    emissor_id: '3',
    receptor_id: '1'
  },
  {
    id: '4',
    emissor: 'Dra. Maria Santos',
    receptor: 'Dra. Ana Costa',
    motivo: 'Avaliação de desempenho estudantil',
    estado: 'concluido',
    data: '2024-01-14',
    hora: '09:15',
    duracao: 60,
    notas: 'Analisados resultados do último trimestre',
    emissor_id: '2',
    receptor_id: '4'
  }
];

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [professores] = useLocalStorage<Professor[]>('professores', initialProfessores);
  const [turmas] = useLocalStorage<Turma[]>('turmas', initialTurmas);
  const [contactos] = useLocalStorage<Contacto[]>('contactos', initialContactos);

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            professores={professores}
            turmas={turmas}
            contactos={contactos}
            onNavigate={setActiveTab}
          />
        );
      case 'professores':
        return <Professores />;
      case 'turmas':
        return <Turmas professores={professores} />;
      case 'contactos':
        return <Contactos professores={professores} />;
      case 'relatorios':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
            <p className="text-gray-600">Módulo de relatórios será implementado em breve.</p>
          </div>
        );
      case 'configuracoes':
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Módulo de configurações será implementado em breve.</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            professores={professores}
            turmas={turmas}
            contactos={contactos}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  return (
    <ProtectedRoute>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;