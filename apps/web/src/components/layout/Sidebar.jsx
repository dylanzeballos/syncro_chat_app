import { Button } from "../ui/Button";
import { LogoutIcon, PlusIcon } from "../icons";
import RoomList from "../../features/chat/components/RoomList";

const Sidebar = ({
  user,
  rooms,
  currentRoom,
  setCurrentRoom,
  setShowCreateRoom,
  setShowJoinRoom,
  isConnected,
  signOut,
}) => {
  const handleRoomSelect = (room) => setCurrentRoom(room);
  const copyRoomCode = (code) => navigator.clipboard?.writeText(code);

  return (
    <>
      <aside className="chat-sidebar flex flex-col h-full">

        {/* HEADER */}
        <div className="chat-header p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text">Syncro Chat</h1>

            <div className="flex items-center space-x-2">
              <div
                className={
                  isConnected
                    ? "chat-status-connected"
                    : "chat-status-disconnected"
                }
              />
              <span className="text-sm text-text-muted">
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowCreateRoom(true)}
              variant="primary"
              size="sm"
              className="flex-1"
              icon={PlusIcon}
            >
              Crear Sala
            </Button>
            <Button
              onClick={() => setShowJoinRoom(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Unirse a Sala
            </Button>
          </div>
        </div>

        {/*scroll*/}
        <div className="flex-1 px-4 overflow-y-auto custom-scroll">
          <RoomList
            rooms={rooms}
            currentRoom={currentRoom}
            onSelectRoom={handleRoomSelect}
            onCopyCode={copyRoomCode}
          />
        </div>

        <div className="chat-user-info p-4 border-t border-white/10 flex items-center space-x-3">
          <img
            src={user.user_metadata?.avatar_url || "/default-avatar.png"}
            alt={user.user_metadata?.full_name || user.email}
            className="chat-avatar"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs text-text-muted truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            icon={LogoutIcon}
            className="chat-icon-button"
            title="Cerrar sesión"
          />
        </div>
      </aside>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
