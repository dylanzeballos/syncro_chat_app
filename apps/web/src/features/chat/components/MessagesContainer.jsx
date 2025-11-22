import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { EmptyMessagesIcon } from '../../../components/icons';

const getMessageProps = (message, index, currentUser, allMessages) => {
  const isOwn = message.users?.id === currentUser?.id;
  const prevMessage = index > 0 ? allMessages[index - 1] : null;
  const nextMessage = index < allMessages.length - 1 ? allMessages[index + 1] : null;

  const showAvatar = !prevMessage || prevMessage.users?.id !== message.users?.id;
  
  const showTimestamp = !prevMessage || 
    (new Date(message.created_at) - new Date(prevMessage.created_at)) > 5 * 60 * 1000;

  const isLastInGroup = !nextMessage || nextMessage.users?.id !== message.users?.id;

  return { isOwn, showAvatar, showTimestamp, isLastInGroup };
};

const MessagesContainer = ({
  messagesContainerRef,
  onScroll,
  messages,
  user,
  typingUsers,
  messagesEndRef,
}) => {
  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-background"
      onScroll={onScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-60">
              <EmptyMessagesIcon className="w-full h-full" />
            </div>
            <p className="text-text-muted">Aún no hay mensajes</p>
            <p className="text-sm text-text-muted opacity-60 mt-1">¡Sé el primero en decir algo!</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => {
          const { isOwn, showAvatar, showTimestamp, isLastInGroup } = getMessageProps(message, index, user, messages);

          return (
            <div key={message.id || message.tempId} className={isLastInGroup ? 'mb-4' : 'mb-1'}>
              <MessageBubble
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTimestamp={showTimestamp}
              />
            </div>
          );
        })
      )}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
