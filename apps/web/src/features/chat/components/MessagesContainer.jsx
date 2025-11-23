import { useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { EmptyMessagesIcon } from '../../../components/icons';

const getMessageProps = (message, index, currentUser, allMessages) => {
  const isOwn = message.users?.id === currentUser?.id;
  const prevMessage = index > 0 ? allMessages[index - 1] : null;
  const nextMessage = index < allMessages.length - 1 ? allMessages[index + 1] : null;

  const showAvatar = !prevMessage || prevMessage.users?.id !== message.users?.id;
  
  // ✔ Cambio 4: siempre mostrar la hora
  const showTimestamp = true;

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
  const [activeDay, setActiveDay] = useState(null);

  const handleScroll = (e) => {
    if (onScroll) onScroll(e);

    const container = messagesContainerRef?.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const seps = container.querySelectorAll('.day-separator');
    let current = null;
    seps.forEach((el) => {
      if (el.offsetTop <= scrollTop + 20) {
        current = el.dataset.day;
      }
    });

    if (current !== activeDay) setActiveDay(current);
  };

  useEffect(() => {
    const container = messagesContainerRef?.current;
    if (!container) return;
    const seps = container.querySelectorAll('.day-separator');
    setTimeout(() => {
      if (seps.length > 0) {
        setActiveDay(seps[0].dataset.day || null);
      } else {
        setActiveDay(null);
      }
    }, 0);
  }, [messages, messagesContainerRef]);

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  const formatDayLabel = (date) => {
    if (!date) return '';
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return 'Hoy';
    if (isSameDay(date, yesterday)) return 'Ayer';

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-background"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {activeDay && (
        <div className="sticky top-0 z-10 pointer-events-none">
          <div className="flex justify-center">
            <div className="bg-background/80 text-sm text-text-muted py-1 px-2">{activeDay}</div>
          </div>
        </div>
      )}
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
        (() => {
          const nodes = [];
          let lastDayLabel = null;

          messages.forEach((message, index) => {
            const msgDate = message.created_at ? new Date(message.created_at) : (message.timestamp ? new Date(message.timestamp) : null);
            const dayLabel = msgDate ? formatDayLabel(msgDate) : null;

            if (dayLabel && dayLabel !== lastDayLabel) {
              nodes.push(
                <div key={`day-${dayLabel}-${index}`} className="day-separator flex justify-center" data-day={dayLabel}>
                  <div className="text-sm text-text-muted py-2">{dayLabel}</div>
                </div>
              );
              lastDayLabel = dayLabel;
            }

            const { isOwn, showAvatar, showTimestamp, isLastInGroup } = getMessageProps(message, index, user, messages);

            nodes.push(
              <div key={message.id || message.tempId} className={isLastInGroup ? 'mb-4' : 'mb-1'}>
                <MessageBubble
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  showTimestamp={showTimestamp}
                />
              </div>
            );
          });

          return nodes;
        })()
      )}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
