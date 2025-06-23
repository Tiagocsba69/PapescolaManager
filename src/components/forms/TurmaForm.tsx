import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Turma, Professor } from '../../types';

interface TurmaFormProps {
  turma?: Turma | null;
  professores: Professor[];
  onSave: (turma: Omit<Turma, 'id'>) => void;
  onCancel: () => void;
}

const TurmaForm: React.FC<TurmaFormProps> = ({ turma, professores, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    curso: '',
    ano: new Date().getFullYear().toString(),
    codFormacao: '',
    professorId: 0,
    professor: '',
    totalAlunos: 0,
    status: 'ativa' as 'ativa' | 'concluida' | 'suspensa',
    dataInicio: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (turma) {
      setFormData({
        curso: turma.curso,
        ano: turma.ano,
        codFormacao: turma.codFormacao,
        professorId: turma.professorId,
        professor: turma.professor,
        totalAlunos: turma.totalAlunos,
        status: turma.status,
        dataInicio: turma.dataInicio
      });
    }
  }, [turma]);

  const generateCodFormacao = (curso: string, ano: string) => {
    const prefix = curso.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${ano}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.curso.trim()) {
      newErrors.curso = 'Nome do curso é obrigatório';
    }

    if (!formData.ano.trim()) {
      newErrors.ano = 'Ano é obrigatório';
    }

    if (formData.professorId === 0) {
      newErrors.professorId = 'Professor é obrigatório';
    }

    if (formData.totalAlunos < 0) {
      newErrors.totalAlunos = 'Número de alunos deve ser positivo';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedProfessor = professores.find(p => p.id === formData.professorId);
      const codFormacao = formData.codFormacao || generateCodFormacao(formData.curso, formData.ano);
      
      onSave({
        ...formData,
        professor: selectedProfessor?.nome || '',
        codFormacao
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'professorId' || name === 'totalAlunos' ? parseInt(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {turma ? 'Editar Turma' : 'Criar Turma'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Curso *
            </label>
            <input
              type="text"
              id="curso"
              name="curso"
              value={formData.curso}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.curso ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Matemática Avançada"
            />
            {errors.curso && <p className="text-red-500 text-xs mt-1">{errors.curso}</p>}
          </div>

          <div>
            <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
              Ano *
            </label>
            <select
              id="ano"
              name="ano"
              value={formData.ano}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.ano ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i - 2;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
            {errors.ano && <p className="text-red-500 text-xs mt-1">{errors.ano}</p>}
          </div>

          <div>
            <label htmlFor="codFormacao" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Formação
            </label>
            <input
              type="text"
              id="codFormacao"
              name="codFormacao"
              value={formData.codFormacao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Será gerado automaticamente se vazio"
            />
            <p className="text-xs text-gray-500 mt-1">Deixe vazio para gerar automaticamente</p>
          </div>

          <div>
            <label htmlFor="professorId" className="block text-sm font-medium text-gray-700 mb-1">
              Professor Responsável *
            </label>
            <select
              id="professorId"
              name="professorId"
              value={formData.professorId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.professorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>Selecione um professor</option>
              {professores.filter(p => p.status === 'ativo').map(professor => (
                <option key={professor.id} value={professor.id}>
                  {professor.nome} - {professor.departamento}
                </option>
              ))}
            </select>
            {errors.professorId && <p className="text-red-500 text-xs mt-1">{errors.professorId}</p>}
          </div>

          <div>
            <label htmlFor="totalAlunos" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Alunos
            </label>
            <input
              type="number"
              id="totalAlunos"
              name="totalAlunos"
              value={formData.totalAlunos}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.totalAlunos ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.totalAlunos && <p className="text-red-500 text-xs mt-1">{errors.totalAlunos}</p>}
          </div>

          <div>
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Início *
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.dataInicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dataInicio && <p className="text-red-500 text-xs mt-1">{errors.dataInicio}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="ativa">Ativa</option>
              <option value="concluida">Concluída</option>
              <option value="suspensa">Suspensa</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
            >
              {turma ? 'Guardar Alterações' : 'Criar Turma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurmaForm;