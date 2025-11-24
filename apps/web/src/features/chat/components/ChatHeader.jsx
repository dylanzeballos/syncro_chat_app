import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { UsersIcon } from "../../../components/icons";
import RoomInfoModal from "./RoomInfoModal";

const ChatHeader = ({
  room,
  isConnected,
  memberCount,
  onlineCount,
  onShowMembers,
  membersLoading,
  onLeave,
  isLeaving,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-surface border-b px-6 py-4" style={{ borderColor: 'var(--color-700)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onClick={handleOpenModal}
            >
              <span className="text-text font-semibold text-sm">
                {room.name ? room.name.charAt(0).toUpperCase() : 'S'}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text" onClick={handleOpenModal}>
              {room.name || 'Sala sin nombre'}
            </h2>
            <div className="flex items-center text-sm text-text-muted">
              {isConnected ? (
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  {memberCount > 0 ? `${onlineCount} de ${memberCount} en línea` : 'Cargando miembros...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                  Conectando...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={UsersIcon}
            onClick={onShowMembers}
            className="chat-icon-button"
            title="Ver miembros"
            disabled={membersLoading}
          >
            {memberCount > 0 && (
              <span className="ml-1 text-xs">{memberCount}</span>
            )}
          </Button>
        </div>
      </div>

      {room.description && (
        <div
          className="mt-2 text-sm text-text-muted truncate max-w-full"
          style={{ maxWidth: '550px' }}
          title={room.description}
          onClick={handleOpenModal}
        >
          {room.description}
        </div>
      )}



      {isModalOpen && <RoomInfoModal room={room} onClose={handleCloseModal} onLeave={onLeave} isLeaving={isLeaving} />}
    </div>
  );
};

export default ChatHeader;
