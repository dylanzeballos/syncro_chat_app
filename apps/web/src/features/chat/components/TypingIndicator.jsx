import { useEffect, useState, useRef } from 'react';

const TypingIndicator = ({ typingUsers = [] }) => {
  const [dots, setDots] = useState('');
  const intervalRef = useRef(null);
  const isActive = typingUsers.length > 0;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isActive) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} está escribiendo`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} y ${typingUsers[1].username} están escribiendo`;
    } else {
      return `${typingUsers[0].username} y ${typingUsers.length - 1} más están escribiendo`;
    }
  };

  return (
    <div className="chat-typing-indicator">
      <div className="flex items-center space-x-3">
        <div className="shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-600)' }}
          >
            <div className="flex space-x-1">
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: 'var(--color-text-muted)',
                  animationDelay: '0ms',
                  animationDuration: '1.4s'
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: 'var(--color-text-muted)',
                  animationDelay: '150ms',
                  animationDuration: '1.4s'
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: 'var(--color-text-muted)',
                  animationDelay: '300ms',
                  animationDuration: '1.4s'
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-text-muted italic">
          {getTypingText()}{dots}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
