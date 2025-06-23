import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Contacto, Professor } from '../../types';

interface ContactoFormProps {
  contacto?: Contacto | null;
  professores: Professor[];
  onSave: (contacto: Omit<Contacto, 'id'>) => void;
  onCancel: () => void;
}

const ContactoForm: React.FC<ContactoFormProps> = ({ contacto, professores, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    emissor: '',
    receptor: '',
    motivo: '',
    estado: 'pendente' as 'pendente' | 'em_progresso' | 'concluido' | 'cancelado',
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    duracao: 0,
    notas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contacto) {
      setFormData({
        emissor: contacto.emissor,
        receptor: contacto.receptor,
        motivo: contacto.motivo,
        estado: contacto.estado,
        data: contacto.data,
        hora: contacto.hora,
        duracao: contacto.duracao || 0,
        notas: contacto.notas || ''
      });
    }
  }, [contacto]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emissor.trim()) {
      newErrors.emissor = 'Emissor é obrigatório';
    }

    if (!formData.receptor.trim()) {
      newErrors.receptor = 'Receptor é obrigatório';
    }

    if (formData.emissor === formData.receptor) {
      newErrors.receptor = 'Emissor e receptor devem ser diferentes';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'Motivo é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    if (!formData.hora) {
      newErrors.hora = 'Hora é obrigatória';
    }

    if (formData.duracao < 0) {
      newErrors.duracao = 'Duração deve ser positiva';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        duracao: formData.duracao || undefined,
        notas: formData.notas || undefined
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duracao' ? parseInt(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const activeProfessores = professores.filter(p => p.status === 'ativo');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {contacto ? 'Editar Contacto' : 'Registar Contacto'}
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
            <label htmlFor="emissor" className="block text-sm font-medium text-gray-700 mb-1">
              Emissor *
            </label>
            <select
              id="emissor"
              name="emissor"
              value={formData.emissor}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.emissor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o emissor</option>
              {activeProfessores.map(professor => (
                <option key={`emissor-${professor.id}`} value={professor.nome}>
                  {professor.nome} - {professor.departamento}
                </option>
              ))}
            </select>
            {errors.emissor && <p className="text-red-500 text-xs mt-1">{errors.emissor}</p>}
          </div>

          <div>
            <label htmlFor="receptor" className="block text-sm font-medium text-gray-700 mb-1">
              Receptor *
            </label>
            <select
              id="receptor"
              name="receptor"
              value={formData.receptor}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.receptor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o receptor</option>
              {activeProfessores.map(professor => (
                <option key={`receptor-${professor.id}`} value={professor.nome}>
                  {professor.nome} - {professor.departamento}
                </option>
              ))}
            </select>
            {errors.receptor && <p className="text-red-500 text-xs mt-1">{errors.receptor}</p>}
          </div>

          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo *
            </label>
            <input
              type="text"
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.motivo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Reunião sobre programa curricular"
            />
            {errors.motivo && <p className="text-red-500 text-xs mt-1">{errors.motivo}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.data ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
            </div>

            <div>
              <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.hora ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="pendente">Pendente</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label htmlFor="duracao" className="block text-sm font-medium text-gray-700 mb-1">
              Duração (minutos)
            </label>
            <input
              type="number"
              id="duracao"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.duracao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.duracao && <p className="text-red-500 text-xs mt-1">{errors.duracao}</p>}
          </div>

          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Observações adicionais..."
            />
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
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
            >
              {contacto ? 'Guardar Alterações' : 'Registar Contacto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactoForm;