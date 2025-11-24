import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { SendIcon } from '../../../components/icons';

const MessageInput = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Escribe un mensaje..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (newValue.trim()) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTypingStart?.();
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onTypingStop?.();
      }, 1000);
    } else {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStop?.();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [onTypingStart, onTypingStop]);

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStop?.();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [message, disabled, onSendMessage, onTypingStop]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="chat-input-container">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <div className="chat-input">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows="1"
              className="chat-textarea"
              style={{ lineHeight: '1.25' }}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          icon={SendIcon}
          className={`chat-send-button ${
            message.trim() && !disabled ? 'active' : 'inactive'
          }`}
          title="Enviar mensaje"
        />
      </div>
    </div>
  );
};

export default MessageInput;
