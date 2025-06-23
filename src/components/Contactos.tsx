import React, { useState } from 'react';
import { Search, Plus, Phone, Clock, User, MessageCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Contacto, Professor } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ContactoForm from './forms/ContactoForm';

const initialContactos: Contacto[] = [
  {
    id: 1,
    emissor: 'Dr. João Silva',
    receptor: 'Dra. Maria Santos',
    motivo: 'Reunião sobre programa curricular',
    estado: 'concluido',
    data: '2025-01-15',
    hora: '14:30',
    duracao: 45,
    notas: 'Discutido alterações ao programa de matemática'
  },
  {
    id: 2,
    emissor: 'Dra. Ana Costa',
    receptor: 'Prof. Carlos Oliveira',
    motivo: 'Coordenação de projeto de pesquisa',
    estado: 'em_progresso',
    data: '2025-01-16',
    hora: '10:00',
    duracao: 30
  },
  {
    id: 3,
    emissor: 'Prof. Carlos Oliveira',
    receptor: 'Dr. João Silva',
    motivo: 'Discussão sobre recursos laboratoriais',
    estado: 'pendente',
    data: '2025-01-17',
    hora: '15:00'
  },
  {
    id: 4,
    emissor: 'Dra. Maria Santos',
    receptor: 'Dra. Ana Costa',
    motivo: 'Avaliação de desempenho estudantil',
    estado: 'concluido',
    data: '2025-01-14',
    hora: '09:15',
    duracao: 60,
    notas: 'Analisados resultados do último trimestre'
  }
];

interface ContactosProps {
  professores: Professor[];
}

const Contactos: React.FC<ContactosProps> = ({ professores }) => {
  const [contactos, setContactos] = useLocalStorage<Contacto[]>('contactos', initialContactos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Contacto | null>(null);

  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = contacto.emissor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacto.receptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacto.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'todos' || contacto.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (contacto: Contacto) => {
    setEditingContacto(contacto);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingContacto(null);
    setShowModal(true);
  };

  const handleSave = (contactoData: Omit<Contacto, 'id'>) => {
    if (editingContacto) {
      // Editar contacto existente
      setContactos(prev => prev.map(c => 
        c.id === editingContacto.id 
          ? { ...contactoData, id: editingContacto.id }
          : c
      ));
    } else {
      // Adicionar novo contacto
      const newId = Math.max(...contactos.map(c => c.id), 0) + 1;
      setContactos(prev => [...prev, { ...contactoData, id: newId }]);
    }
    setShowModal(false);
    setEditingContacto(null);
  };

  const handleDelete = (contacto: Contacto) => {
    setDeleteConfirm(contacto);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setContactos(prev => prev.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-emerald-100 text-emerald-800';
      case 'em_progresso':
        return 'bg-blue-100 text-blue-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Phone className="h-4 w-4 text-emerald-600" />;
      case 'em_progresso':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelado':
        return <Phone className="h-4 w-4 text-red-600" />;
      default:
        return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="todos">Todos os Estados</option>
            <option value="pendente">Pendente</option>
            <option value="em_progresso">Em Progresso</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Registar Contacto</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: contactos.length, color: 'bg-gray-600' },
          { label: 'Pendentes', value: contactos.filter(c => c.estado === 'pendente').length, color: 'bg-yellow-600' },
          { label: 'Em Progresso', value: contactos.filter(c => c.estado === 'em_progresso').length, color: 'bg-blue-600' },
          { label: 'Concluídos', value: contactos.filter(c => c.estado === 'concluido').length, color: 'bg-emerald-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Phone className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contactos List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Contactos</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredContactos.map((contacto) => (
            <div key={contacto.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(contacto.estado)}
                    <h4 className="text-lg font-medium text-gray-900">{contacto.motivo}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contacto.estado)}`}>
                      {contacto.estado.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Emissor:</span>
                      <span className="text-sm font-medium text-gray-900">{contacto.emissor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Receptor:</span>
                      <span className="text-sm font-medium text-gray-900">{contacto.receptor}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(contacto.data).toLocaleDateString('pt-PT')} às {contacto.hora}</span>
                    </div>
                    {contacto.duracao && (
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{contacto.duracao} minutos</span>
                      </div>
                    )}
                  </div>

                  {contacto.notas && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{contacto.notas}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(contacto)}
                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors duration-200"
                    title="Editar contacto"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(contacto)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                    title="Eliminar contacto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <ContactoForm
          contacto={editingContacto}
          professores={professores}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingContacto(null);
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
              Tem certeza que deseja eliminar o contacto sobre <strong>{deleteConfirm.motivo}</strong>?
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

export default Contactos;