import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const CreateRoomModal = ({
  onClose,
  onCreate,
  isCreating,
  error,
  setCurrentRoom,
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    isPrivate: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = await onCreate(form);
      setCurrentRoom(room);
      setForm({ name: '', description: '', isPrivate: false });
      onClose();
    } catch {
      console.error('Error creating room');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur">
      <div className="chat-modal">
        <h2 className="text-lg font-semibold mb-4 text-text">Crear Nueva Sala</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la Sala *"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Ingresa el nombre de la sala"
            required
            className="chat-form-input"
          />
          <div>
            <label className="chat-form-label">Descripción</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="chat-form-input"
              placeholder="Descripción opcional"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={form.isPrivate}
              onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}
              className="w-4 h-4 text-primary bg-background border-700 rounded focus:ring-primary"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-text">
              Sala privada (solo por invitación)
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isCreating} className="flex-1">
              Crear Sala
            </Button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error.message}</p>}
      </div>
    </div>
  );
};

export default CreateRoomModal;
