
import React, { useState, useEffect } from 'react';
import { Raffle, RaffleCreationData, GridSizePresetKey } from '../types';
import { ImageIcon } from './icons';
import { DEFAULT_GRID_SIZE_PRESET, GRID_SIZE_PRESETS } from '../constants';

interface AdminRaffleFormProps {
  onSubmit: (raffleData: RaffleCreationData) => void;
  initialData?: Raffle;
}

const AdminRaffleForm: React.FC<AdminRaffleFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<RaffleCreationData>({
    title: '',
    description: '',
    itemImageBase64: undefined,
    ticketPrice: '',
    raffleDate: '',
    lotteryName: '',
    gridSizePreset: DEFAULT_GRID_SIZE_PRESET,
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Partial<RaffleCreationData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        itemImageBase64: initialData.itemImageBase64,
        ticketPrice: initialData.ticketPrice.toString(),
        raffleDate: initialData.raffleDate,
        lotteryName: initialData.lotteryName,
        gridSizePreset: initialData.gridSizePreset || DEFAULT_GRID_SIZE_PRESET,
      });
      if (initialData.itemImageBase64) {
        setImagePreview(initialData.itemImageBase64);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, itemImageBase64: base64String }));
        setImagePreview(base64String);
        setErrors(prev => ({ ...prev, itemImageBase64: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<RaffleCreationData> = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio.";
    if (!formData.description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!formData.ticketPrice.trim()) newErrors.ticketPrice = "El precio es obligatorio.";
    else if (isNaN(parseFloat(formData.ticketPrice)) || parseFloat(formData.ticketPrice) <= 0) newErrors.ticketPrice = "El precio debe ser un número positivo.";
    if (!formData.raffleDate) newErrors.raffleDate = "La fecha es obligatoria.";
    else if (new Date(formData.raffleDate) <= new Date()) newErrors.raffleDate = "La fecha debe ser futura.";
    if (!formData.lotteryName.trim()) newErrors.lotteryName = "El nombre de la lotería es obligatorio.";
    if (!formData.itemImageBase64) newErrors.itemImageBase64 = "La imagen del artículo es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()){
      onSubmit(formData);
    }
  };
  
  const inputClass = (field: keyof Omit<RaffleCreationData, 'gridSizePreset'>) => // gridSizePreset is a select
    `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  
  const selectClass = (field: keyof Pick<RaffleCreationData, 'gridSizePreset'>) =>
    `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;


  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-xl">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">{initialData ? 'Editar Rifa' : 'Crear Nueva Rifa'}</h3>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Rifa</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={inputClass('title')} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className={inputClass('description')} />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700">Imagen del Artículo</label>
        <input type="file" name="itemImage" id="itemImage" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700"/>
        {imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-2 h-32 w-auto rounded-md object-cover" />}
        {errors.itemImageBase64 && <p className="mt-1 text-xs text-red-500">{errors.itemImageBase64}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Precio por Boleto ($)</label>
          <input type="number" name="ticketPrice" id="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} className={inputClass('ticketPrice')} placeholder="Ej: 5" />
          {errors.ticketPrice && <p className="mt-1 text-xs text-red-500">{errors.ticketPrice}</p>}
        </div>
        <div>
          <label htmlFor="raffleDate" className="block text-sm font-medium text-gray-700">Fecha del Sorteo</label>
          <input type="date" name="raffleDate" id="raffleDate" value={formData.raffleDate} onChange={handleInputChange} className={inputClass('raffleDate')} />
          {errors.raffleDate && <p className="mt-1 text-xs text-red-500">{errors.raffleDate}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="lotteryName" className="block text-sm font-medium text-gray-700">Juega con Lotería</label>
        <input type="text" name="lotteryName" id="lotteryName" value={formData.lotteryName} onChange={handleInputChange} className={inputClass('lotteryName')} placeholder="Ej: Lotería Nacional" />
        {errors.lotteryName && <p className="mt-1 text-xs text-red-500">{errors.lotteryName}</p>}
      </div>

      <div>
        <label htmlFor="gridSizePreset" className="block text-sm font-medium text-gray-700">Tamaño de Cuadrícula</label>
        <select
          name="gridSizePreset"
          id="gridSizePreset"
          value={formData.gridSizePreset}
          onChange={handleInputChange}
          className={selectClass('gridSizePreset')}
        >
          {(Object.keys(GRID_SIZE_PRESETS) as GridSizePresetKey[]).map(presetKey => (
            <option key={presetKey} value={presetKey}>
              {presetKey.charAt(0).toUpperCase() + presetKey.slice(1) === 'Compact' ? 'Compacto' : 
               presetKey.charAt(0).toUpperCase() + presetKey.slice(1) === 'Regular' ? 'Regular' : 
               'Grande'}
            </option>
          ))}
        </select>
      </div>


      <button type="submit" className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out">
        {initialData ? 'Actualizar Rifa' : 'Crear Rifa'}
      </button>
    </form>
  );
};

export default AdminRaffleForm;