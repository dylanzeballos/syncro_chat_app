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

  if (message?.message_type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="text-sm text-text-muted italic py-2">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <div className="shrink-0 mr-3">
          {showAvatar ? (            
            <img
              src={message.users?.avatar_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2'%3E%3C/path%3E%3C/svg%3E"}
              alt={message.users?.username || 'Usuario'}
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
