import { useState } from "react";
import { HamburgerIcon, CloseIcon, ChatIcon, LogoutIcon, PlusIcon } from "../icons";
import { Button } from "../ui";

export const Sidebar = ({ 
  user, 
  rooms = [], 
  selectedRoom, 
  onSelectRoom, 
  onLogout,
  onCreateRoom 
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
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Syncro</h1>
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {user?.user_metadata?.username?.charAt(0).toUpperCase() || 
               user?.email?.charAt(0).toUpperCase() || 
               'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.user_metadata?.username || user?.email || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.user_metadata?.is_guest ? 'Invitado' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Salas
          </h2>
          {onCreateRoom && (
            <button
              onClick={onCreateRoom}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Crear sala"
            >
              <PlusIcon className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-8">
            <ChatIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No hay salas</p>
            <p className="text-xs text-gray-400 mt-1">Crea una para empezar</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  onClick={() => handleRoomClick(room)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ChatIcon className="w-5 h-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{room.name}</p>
                      {room.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {room.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          fullWidth
          icon={LogoutIcon}
          onClick={onLogout}
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
      >
        <HamburgerIcon className="w-6 h-6 text-gray-700" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-40"
          onClick={closeMobile}
        />
      )}

      <aside className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
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
