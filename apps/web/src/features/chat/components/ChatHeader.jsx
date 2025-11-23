import { Button } from '../../../components/ui/Button';
import { UsersIcon, CopyIcon } from '../../../components/icons';

const ChatHeader = ({
  room,
  isConnected,
  memberCount,
  onlineCount,
  onShowMembers,
  onCopyCode,
  membersLoading
}) => {
  return (
    <div className="bg-surface border-b px-6 py-4" style={{ borderColor: 'var(--color-700)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span className="text-text font-semibold text-sm">
                {room.name ? room.name.charAt(0).toUpperCase() : 'S'}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text">{room.name || 'Sala sin nombre'}</h2>
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
        <div className="mt-2 text-sm text-text-muted" title={room.description}>
          {room.description}
          <style jsx>{`
            div {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          `}</style>
        </div>
      )}


      {room.code_room && (
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-xs text-text-muted">Código:</span>
          <div className="flex items-center space-x-1 bg-700 rounded px-2 py-1">
            <code className="text-xs font-mono text-text">
              {room.code_room}
            </code>
            <button
              onClick={() => onCopyCode(room.code_room)}
              className="p-1 hover:bg-opacity-20 hover:bg-white rounded transition-opacity"
              title="Copiar código"
            >
              <CopyIcon className="w-3 h-3 text-text-muted hover:text-text" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
