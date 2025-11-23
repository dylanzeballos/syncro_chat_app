import { CopyIcon } from "../../../components/icons";

const RoomList = ({ rooms, currentRoom, onSelectRoom, onCopyCode }) => (
  <div>
    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
      Tus Salas ({rooms.length})
    </h2>
    {rooms.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-text-muted text-sm">No tienes salas aún</p>
        <p className="text-600 text-xs mt-1">Crea o únete a una sala para empezar a chatear</p>
      </div>
    ) : (
      <div className="space-y-2">
        {rooms.map(room => (
          <div
            key={room.id}
            className={`chat-room-item ${currentRoom?.id === room.id ? 'active' : ''}`}
          >
            <div
              className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg w-full"
              onClick={() => onSelectRoom(room)}
            >
              <div className={`chat-room-avatar ${currentRoom?.id === room.id ? 'active' : ''}`}>
                <span className="text-white font-semibold text-sm">
                  {room.name ? room.name.charAt(0).toUpperCase() : 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  <strong>
                  {room.name || 'Sala sin nombre'}
                  </strong> 
                </p>
                {room.description && (
                  <p className="text-sm truncate opacity-70">{room.description}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs opacity-60 italic">{room.code_room}</p>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onCopyCode(room.code_room);
                    }}
                    className="p-1 hover:bg-opacity-20 hover:bg-white rounded text-xs opacity-60 hover:opacity-100 transition-opacity"
                    title="Copiar código"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RoomList;
