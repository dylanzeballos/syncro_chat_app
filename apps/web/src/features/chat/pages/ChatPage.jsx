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
    <div className="flex h-screen bg-gray-100">
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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={loadRooms}
                className="text-blue-600 hover:underline text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : !selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Selecciona una sala para empezar</p>
              <p className="text-sm text-gray-400">
                {rooms.length === 0
                  ? "Crea una sala nueva para comenzar a chatear"
                  : "Elige una sala del menú lateral"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* TODO: Implementar vista de chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
              {selectedRoom.description && (
                <p className="text-sm text-gray-600">
                  {selectedRoom.description}
                </p>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Chat en construcción...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
