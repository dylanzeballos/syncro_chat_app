import { Button } from "../../../components/ui/Button";

const RoomInfoModal = ({ room, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 backdrop-blur">
    <div className="chat-modal">
      <h2 className="text-lg font-semibold mb-4 text-text">Información de la Sala</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Nombre de la Sala:</strong>
          <p className="text-sm text-text-muted">{room.name || 'Sala sin nombre'}</p>
        </div>

        <div>
          <strong>Descripción:</strong>
          <p className="text-sm text-text-muted">{room.description || 'Sin descripción'}</p>
        </div>

        <div>
          <strong>Código de la Sala:</strong>
          <p className="text-sm text-text-muted">{room.code_room || 'No disponible'}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cerrar
        </Button>
      </div>
    </div>
  </div>
);

export default RoomInfoModal;
