import { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { chatAPI } from "../../../services/api";
import { Sidebar } from "../../../components/layout/Sidebar";

export default function ChatPage() {
  const { user, signOut } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatAPI.getRooms();
      setRooms(data || []);
    } catch (err) {
      console.error("Error loading rooms:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleCreateRoom = () => {
    console.log("Create room");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Component */}
      <Sidebar
        user={user}
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
        onLogout={handleSignOut}
        onCreateRoom={handleCreateRoom}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div>Cargando...</div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-red-600">{error}</p>
              <button
                onClick={loadRooms}
                className="hover:underline text-sm text-primary"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : !selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <p className="text-lg mb-2">Selecciona una sala para empezar</p>
              <p className="text-sm text-400">
                {rooms.length === 0
                  ? "Crea una sala nueva para comenzar a chatear"
                  : "Elige una sala del menú lateral"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* TODO: Implementar vista de chat */}
            <div className="p-4 border-b border-200 bg-surface">
              <h2 className="text-lg font-semibold text-text">
                {selectedRoom.name}
              </h2>
              {selectedRoom.description && (
                <p className="text-sm text-text-muted">
                  {selectedRoom.description}
                </p>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center text-400">
              Chat en construcción...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
