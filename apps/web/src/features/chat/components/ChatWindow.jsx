import { useRef, useState, useEffect } from 'react';
import { useRoomMembersQuery, useLeaveRoomMutation } from '../hooks/useRoomQueries';
import { Button } from '../../../components/ui/Button';
import { ScrollDownIcon } from '../../../components/icons';
import EmptyState from './EmptyState';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import MessageInput from './MessageInput';
import MemberList from './MemberList';

const ChatWindow = ({
  room,
  user,
  messages = [],
  typingUsers = [],
  onlineUsers = new Set(),
  onSendMessage,
  onTypingStart,
  onTypingStop,
  isConnected = false,
  leaveRoomSocket,
  setCurrentRoom,
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showMemberList, setShowMemberList] = useState(false);

  const { data: members = [], isLoading: membersLoading } = useRoomMembersQuery(room?.id);
  const leaveRoomMutation = useLeaveRoomMutation();

  const onlineCount = members.filter(m => onlineUsers.has(m.users.id)).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [shouldAutoScroll, messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const copyRoomCode = (code) => {
    navigator.clipboard?.writeText(code);
  };

  const handleSendMessage = (content) => {
    if (room && content.trim()) {
      onSendMessage(room.id, content);
    }
  };

  const handleTypingStart = () => {
    if (room) {
      onTypingStart(room.id);
    }
  };

  const handleTypingStop = () => {
    if (room) {
      onTypingStop(room.id);
    }
  };

  const handleShowMembers = () => setShowMemberList(true);
  const handleCloseMemberList = () => setShowMemberList(false);

  const handleLeaveGroup = async () => {
    try {
      await leaveRoomMutation.mutateAsync(room.id);
      // emit socket leave to notify others
      if (typeof leaveRoomSocket === 'function') {
        leaveRoomSocket(room.id);
      }
      // clear current room to go back to rooms list
      if (typeof setCurrentRoom === 'function') setCurrentRoom(null);
    } catch (err) {
      console.error('Error leaving room', err);
      const serverMsg = err?.originalError?.response?.data?.error || err?.message || 'No se pudo salir de la sala.';
      // show message but still attempt to leave the UI so user isn't stuck
      alert(`${serverMsg} Intentando salir localmente...`);

      try {
        if (typeof leaveRoomSocket === 'function') {
          leaveRoomSocket(room.id);
        }
      } catch (socketErr) {
        console.error('Error emitting leave-room after API failure', socketErr);
      }

      if (typeof setCurrentRoom === 'function') setCurrentRoom(null);
    }
  };

  if (!room) {
    return <EmptyState />;
  }

  const memberCount = members.length;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ChatHeader
        room={room}
        isConnected={isConnected}
        memberCount={memberCount}
        onlineCount={onlineCount}
        onShowMembers={handleShowMembers}
        onCopyCode={() => copyRoomCode(room.code_room)}
        membersLoading={membersLoading}
        onLeave={handleLeaveGroup}
        isLeaving={leaveRoomMutation.isLoading}
      />

      <MessagesContainer
        messagesContainerRef={messagesContainerRef}
        onScroll={handleScroll}
        messages={messages}
        user={user}
        typingUsers={typingUsers}
        messagesEndRef={messagesEndRef}
      />

      {!shouldAutoScroll && (
        <div className="absolute bottom-20 right-6">
          <Button
            variant="primary"
            size="sm"
            onClick={scrollToBottom}
            icon={ScrollDownIcon}
            className="p-2 rounded-full shadow-lg"
            title="Ir al final"
          />
        </div>
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!isConnected}
        placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
      />

      <MemberList
        isOpen={showMemberList}
        onClose={handleCloseMemberList}
        members={members}
        onlineUsers={onlineUsers}
        currentUser={user}
      />
    </div>
  );
};

export default ChatWindow;
