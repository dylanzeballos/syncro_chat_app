import { useState } from "react";
import {
  HamburgerIcon,
  CloseIcon,
  ChatIcon,
  LogoutIcon,
  PlusIcon,
} from "../icons";
import { Button } from "../ui";

export const Sidebar = ({
  user,
  rooms = [],
  selectedRoom,
  onSelectRoom,
  onLogout,
  onCreateRoom,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  const handleRoomClick = (room) => {
    onSelectRoom(room);
    closeMobile();
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-text">Syncro</h1>
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-lg bg-transparent hover:bg-700 transition-colors text-text"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-100">
            <span className="text-sm font-semibold text-primary">
              {user?.user_metadata?.username?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-text">
              {user?.user_metadata?.username || user?.email || "Usuario"}
            </p>
            <p className="text-xs text-text-muted">
              {user?.user_metadata?.is_guest ? "Invitado" : "Online"}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Salas
          </h2>
          {onCreateRoom && (
            <button
              onClick={onCreateRoom}
              className="p-1 rounded transition-colors bg-transparent hover:bg-700 text-text-muted"
              title="Crear sala"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-8">
            <ChatIcon className="w-12 h-12 mx-auto mb-2 text-300" />
            <p className="text-sm text-text-muted">No hay salas</p>
            <p className="text-xs mt-1 text-400">Crea una para empezar</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  onClick={() => handleRoomClick(room)}
                  className={`w-full text-left p-3 rounded-lg transition-colors font-medium flex items-center gap-2 hover:bg-700 ${
                    selectedRoom?.id === room.id
                      ? "bg-700 text-text"
                      : "text-text-muted"
                  }`}
                >
                  <ChatIcon className="w-5 h-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-text">
                      {room.name}
                    </p>
                    {room.description && (
                      <p className="text-xs truncate text-text-muted">
                        {room.description}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-200">
        <Button
          type="button"
          variant="outline"
          fullWidth
          icon={LogoutIcon}
          onClick={onLogout}
          className="hover:bg-700"
        >
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md bg-surface hover:bg-700 text-text transition-colors"
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
        />
      )}

      <aside className="hidden lg:flex lg:flex-col w-80 border-r border-200 bg-surface">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-80 shadow-xl z-50 flex flex-col transform transition-transform duration-300 bg-surface ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  user: {
    user_metadata: {
      username: String,
      is_guest: Boolean,
    },
    email: String,
  },
  rooms: Array,
  selectedRoom: Object,
  onSelectRoom: Function,
  onLogout: Function,
  onCreateRoom: Function,
};
