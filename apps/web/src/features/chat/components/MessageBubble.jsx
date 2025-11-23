import { CheckIcon, DoubleCheckIcon } from '../../../components/icons';

const MessageBubble = ({
  message,
  isOwn = false,
  showAvatar = true,
  showTimestamp = true
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render system messages (join/leave labels) centered and simplified
  if (message?.message_type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="text-sm text-text-muted italic py-2">
          {message.content}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        );
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-text-muted" />;
      case 'delivered':
        return <DoubleCheckIcon className="w-4 h-4 text-text-muted" />;
      case 'read':
        return <DoubleCheckIcon className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <div className="shrink-0 mr-3">
          {showAvatar ? (
            <img
              src={message.users?.avatar_url || message.user?.avatarUrl || '/default-avatar.png'}
              alt={message.users?.username || message.user?.username || 'Usuario'}
              className="chat-avatar"
            />
          ) : (
            <div className="chat-message-spacer" />
          )}
        </div>
      )}

      <div className="chat-message-content">
        {!isOwn && showAvatar && (
          <div className="chat-message-username">
            {message.users?.username || message.user?.username || 'Usuario desconocido'}
          </div>
        )}

        <div className={`chat-message-bubble ${isOwn ? 'own' : 'other'}`}>
          <div className="wrap-break-word">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>

          {showTimestamp && (
            <div className={`chat-message-time ${
              isOwn ? 'text-200' : 'text-text-muted'
            }`}>
              <div className="flex items-center space-x-1">
                <span>
                  {formatTime(message.created_at || message.timestamp)}
                </span>

                {/* ✔ PRIMER CAMBIO: eliminamos el check */}
                {/* {isOwn && getStatusIcon(message.status || 'sent')} */}
              </div>
            </div>
          )}
        </div>
      </div>

      {isOwn && <div className="shrink-0 w-11"></div>}
    </div>
  );
};

export default MessageBubble;
