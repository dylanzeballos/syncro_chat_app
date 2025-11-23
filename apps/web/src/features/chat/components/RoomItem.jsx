import { useState } from "react";
import { CopyIcon, CheckIcon } from "../../../components/icons";

const RoomItem = ({ room, currentRoom, onSelectRoom, onCopyCode }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = (e) => {
    e.stopPropagation();
    onCopyCode(room.code_room);
    
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      key={room.id}
      className={`chat-room-item ${currentRoom?.id === room.id ? "active" : ""}`}
    >
      <div
        className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg w-full"
        onClick={() => onSelectRoom(room)}
      >
        <div
          className={`chat-room-avatar ${currentRoom?.id === room.id ? "active" : ""}`}
        >
          <span className="text-white font-semibold text-sm">
            {room.name ? room.name.charAt(0).toUpperCase() : "S"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            <strong>{room.name || "Sala sin nombre"}</strong>
          </p>
          {room.description && (
            <p className="text-sm truncate opacity-70">{room.description}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs opacity-60 italic">{room.code_room}</p>
            <button
              onClick={handleCopyClick}
              className="p-1 hover:bg-opacity-20 hover:bg-white rounded text-xs opacity-60 hover:opacity-100 transition-opacity"
              title="Copiar código"
            >
              {isCopied ? (
                <>
                <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <p className="ml-2 text-xs text-green-500">Código copiado</p>
                </div>
                </>
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
