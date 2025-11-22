import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const JoinRoomModal = ({
  onClose,
  onJoin,
  isJoining,
  error,
  setCurrentRoom,
}) => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = await onJoin(code.trim());
      setCurrentRoom(room);
      setCode('');
      onClose();
    } catch {
      console.error('Error joining room');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur">
      <div className="chat-modal">
        <h2 className="text-lg font-semibold mb-4 text-text">Unirse a Sala</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Código de Sala *"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Ingresa el código de 10 caracteres"
            maxLength={10}
            required
            className="chat-form-input font-mono"
          />
          <p className="text-xs text-text-muted">
            Los códigos de sala tienen 10 caracteres (letras y números)
          </p>
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isJoining} className="flex-1">
              Unirse
            </Button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error.message}</p>}
      </div>
    </div>
  );
};

export default JoinRoomModal;
