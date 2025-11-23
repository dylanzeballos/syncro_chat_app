import RoomItem from "./RoomItem";

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
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            currentRoom={currentRoom}
            onSelectRoom={onSelectRoom}
            onCopyCode={onCopyCode}
          />
        ))}
      </div>
    )}
  </div>
);

export default RoomList;
