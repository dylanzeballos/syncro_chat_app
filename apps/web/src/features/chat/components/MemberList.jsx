import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { CloseIcon } from '../../../components/icons';
import { MemberItem } from './MemberItem';

const MemberList = ({
  isOpen,
  onClose,
  members = [],
  onlineUsers = new Set(),
  currentUser = null,
}) => {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const onlineMembers = members.filter(member => onlineUsers.has(member.users.id));
  const offlineMembers = members.filter(member => !onlineUsers.has(member.users.id));

  const getFilteredMembers = () => {
    switch (filter) {
      case 'online':
        return onlineMembers;
      case 'offline':
        return offlineMembers;
      default:
        return members;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-80 h-full bg-surface border-l border-700 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-700">
          <div>
            <h3 className="text-lg font-semibold text-text">
              Miembros — {members.length}
            </h3>
            <p className="text-sm text-text-muted">
              {onlineMembers.length} en línea, {offlineMembers.length} desconectados
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={CloseIcon}
            className="chat-icon-button"
            title="Cerrar"
          />
        </div>

        <div className="p-4 border-b border-700">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-text'
                  : 'bg-700 text-text-muted hover:bg-600 hover:text-text'
              }`}
            >
              Todos ({members.length})
            </button>
            <button
              onClick={() => setFilter('online')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'online'
                  ? 'bg-primary text-text'
                  : 'bg-700 text-text-muted hover:bg-600 hover:text-text'
              }`}
            >
              En línea ({onlineMembers.length})
            </button>
            <button
              onClick={() => setFilter('offline')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'offline'
                  ? 'bg-primary text-text'
                  : 'bg-700 text-text-muted hover:bg-600 hover:text-text'
              }`}
            >
              Desconectados ({offlineMembers.length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filter === 'all' ? (
            <>
              {onlineMembers.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    En línea — {onlineMembers.length}
                  </h4>
                  <div className="space-y-1">
                    {onlineMembers.map((member) => (
                      <MemberItem
                        key={member.users.id}
                        member={member}
                        isOnline={true}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                </div>
              )}

              {offlineMembers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Desconectados — {offlineMembers.length}
                  </h4>
                  <div className="space-y-1">
                    {offlineMembers.map((member) => (
                      <MemberItem
                        key={member.users.id}
                        member={member}
                        isOnline={false}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-1">
              {getFilteredMembers().map((member) => (
                <MemberItem
                  key={member.users.id}
                  member={member}
                  isOnline={onlineUsers.has(member.users.id)}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}

          {getFilteredMembers().length === 0 && (
            <div className="text-center py-8">
              <div className="text-text-muted">
                {filter === 'online' && 'No hay miembros en línea'}
                {filter === 'offline' && 'No hay miembros desconectados'}
                {filter === 'all' && 'No hay miembros en esta sala'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
