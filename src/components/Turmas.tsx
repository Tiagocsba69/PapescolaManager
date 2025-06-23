import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, Calendar, AlertTriangle } from 'lucide-react';
import { Turma, Professor } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TurmaForm from './forms/TurmaForm';

const initialTurmas: Turma[] = [
  {
    id: 1,
    curso: 'Matemática Avançada',
    ano: '2024',
    codFormacao: 'MAT2024-001',
    professor: 'Dr. João Silva',
    professorId: 1,
    totalAlunos: 28,
    status: 'ativa',
    dataInicio: '2024-02-15'
  },
  {
    id: 2,
    curso: 'Física Quântica',
    ano: '2024',
    codFormacao: 'FIS2024-002',
    professor: 'Dra. Maria Santos',
    professorId: 2,
    totalAlunos: 22,
    status: 'ativa',
    dataInicio: '2024-03-01'
  },
  {
    id: 3,
    curso: 'Química Orgânica',
    ano: '2023',
    codFormacao: 'QUI2023-015',
    professor: 'Prof. Carlos Oliveira',
    professorId: 3,
    totalAlunos: 31,
    status: 'concluida',
    dataInicio: '2023-08-20'
  },
  {
    id: 4,
    curso: 'Biologia Molecular',
    ano: '2024',
    codFormacao: 'BIO2024-003',
    professor: 'Dra. Ana Costa',
    professorId: 4,
    totalAlunos: 25,
    status: 'ativa',
    dataInicio: '2024-01-30'
  }
];

interface TurmasProps {
  professores: Professor[];
}

const Turmas: React.FC<TurmasProps> = ({ professores }) => {
  const [turmas, setTurmas] = useLocalStorage<Turma[]>('turmas', initialTurmas);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Turma | null>(null);

  const filteredTurmas = turmas.filter(turma =>
    turma.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    turma.codFormacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    turma.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTurma(null);
    setShowModal(true);
  };

  const handleSave = (turmaData: Omit<Turma, 'id'>) => {
    if (editingTurma) {
      // Editar turma existente
      setTurmas(prev => prev.map(t => 
        t.id === editingTurma.id 
          ? { ...turmaData, id: editingTurma.id }
          : t
      ));
    } else {
      // Adicionar nova turma
      const newId = Math.max(...turmas.map(t => t.id), 0) + 1;
      setTurmas(prev => [...prev, { ...turmaData, id: newId }]);
    }
    setShowModal(false);
    setEditingTurma(null);
  };

  const handleDelete = (turma: Turma) => {
    setDeleteConfirm(turma);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setTurmas(prev => prev.filter(t => t.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-emerald-100 text-emerald-800';
      case 'concluida':
        return 'bg-blue-100 text-blue-800';
      case 'suspensa':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Pesquisar turmas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Turma</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Turmas Ativas</p>
              <p className="text-2xl font-bold text-emerald-600">
                {turmas.filter(t => t.status === 'ativa').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-blue-600">
                {turmas.reduce((sum, turma) => sum + turma.totalAlunos, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Turmas Concluídas</p>
              <p className="text-2xl font-bold text-gray-600">
                {turmas.filter(t => t.status === 'concluida').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Turmas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTurmas.map((turma) => (
          <div key={turma.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{turma.curso}</h3>
                <p className="text-sm text-gray-600">{turma.codFormacao}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(turma.status)}`}>
                {turma.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Professor:</span>
                <span className="text-sm font-medium text-gray-900">{turma.professor}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ano:</span>
                <span className="text-sm font-medium text-gray-900">{turma.ano}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alunos:</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{turma.totalAlunos}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Início:</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(turma.dataInicio).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleEdit(turma)}
                className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 transition-colors duration-200"
                title="Editar turma"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDelete(turma)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                title="Eliminar turma"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showModal && (
        <TurmaForm
          turma={editingTurma}
          professores={professores}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingTurma(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminação</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja eliminar a turma <strong>{deleteConfirm.curso}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turmas;