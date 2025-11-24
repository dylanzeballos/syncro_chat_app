import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useWebSocketWithQuery } from '../hooks/useWebSocketWithQuery';
import { useRoomsQuery, useRoomMessagesQuery, useCreateRoomMutation, useJoinRoomMutation } from '../hooks/useRoomQueries';
import { useInitAuth } from '../hooks/useInitAuth';
import ChatWindow from '../components/ChatWindow';
import CreateRoomModal from '../components/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal';
import EmptyState from '../components/EmptyState';
import Sidebar from '../../../components/layout/Sidebar';
import { LoadingSpinner } from '../../../components/icons';

const ChatPage = () => {
  const { user, getValidToken, loading: authLoading, signOut } = useAuth();
  const [token, setToken] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const { data: rooms = [], isLoading: roomsLoading, error: roomsError } = useRoomsQuery();
  const { data: messages = [] } = useRoomMessagesQuery(currentRoom?.id);
  const { mutate: createRoom, isPending: isCreating, error: createError } = useCreateRoomMutation();
  const { mutate: joinRoomByCode, isPending: isJoining, error: joinError } = useJoinRoomMutation();

  const { isConnected, joinRoom, leaveRoom, sendMessage, startTyping, stopTyping, typingUsers, onlineUsers } = useWebSocketWithQuery(token);

  const { isSyncingUser } = useInitAuth({
    user,
    authLoading,
    getValidToken,
    setToken,
    signOut,
  });

  useEffect(() => {
    if (currentRoom && isConnected) {
      joinRoom(currentRoom.id);
    }
    return () => {
      if (currentRoom && isConnected) {
        leaveRoom(currentRoom.id);
      }
    };
  }, [currentRoom, isConnected, joinRoom, leaveRoom]);

  if (authLoading || roomsLoading || isSyncingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
        <p className="text-text-muted">Cargando...</p>
      </div>
    );
  }

  if (roomsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-error mb-2">Error cargando salas</p>
          <p className="text-text-muted text-sm">{roomsError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar
          user={user}
          rooms={rooms}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          setShowCreateRoom={setShowCreateRoom}
          setShowJoinRoom={setShowJoinRoom}
          isConnected={isConnected}
          signOut={signOut}
        />
        {!currentRoom || rooms.length === 0 ? (
          <EmptyState />
        ) : (
          <ChatWindow
              room={currentRoom}
              user={user}
              messages={messages}
              typingUsers={typingUsers}
              onlineUsers={onlineUsers}
              onSendMessage={sendMessage}
              onTypingStart={startTyping}
              onTypingStop={stopTyping}
              isConnected={isConnected}
              leaveRoomSocket={leaveRoom}
              setCurrentRoom={setCurrentRoom}
            />
        )}
      </div>
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={createRoom}
          isCreating={isCreating}
          error={createError}
          setCurrentRoom={setCurrentRoom}
        />
      )}
      {showJoinRoom && (
        <JoinRoomModal
          onClose={() => setShowJoinRoom(false)}
          onJoin={joinRoomByCode}
          isJoining={isJoining}
          error={joinError}
          setCurrentRoom={setCurrentRoom}
        />
      )}
    </div>
  );
};

export default ChatPage;
