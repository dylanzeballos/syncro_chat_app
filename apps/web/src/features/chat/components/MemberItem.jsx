import { formatLastSeen } from "../utils";

export const MemberItem = ({ member, isOnline, currentUser }) => {
  const isCurrentUser = String(member.users.id) === String(currentUser?.id);

  return (
    <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-700 ${
      isOnline ? 'opacity-100' : 'opacity-50'
    }`}>
      <div className="relative shrink-0">
        <img
          src={member.users.avatar_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2'%3E%3C/path%3E%3C/svg%3E"}
          alt={member.users.username || 'Usuario'}
          className={`w-8 h-8 rounded-full object-cover border-2 ${
            isOnline ? 'border-primary' : 'border-600'
          }`}
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
          isOnline ? 'bg-green-400' : 'bg-600'
        }`}></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center min-w-0">
            <p
              className={`text-sm font-medium truncate max-w-40 ${
                isOnline ? 'text-text' : 'text-text-muted'
              }`}
              title={member.users.username || 'Usuario sin nombre'}
            >
              {member.users.username || 'Usuario sin nombre'}
            </p>
            {isCurrentUser && (
              <span className="text-xs text-primary ml-2 whitespace-nowrap shrink-0">(tú)</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {member.role === 'admin' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-text whitespace-nowrap">
                Admin
              </span>
            )}
            {member.role === 'moderator' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-text whitespace-nowrap">
                Mod
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs ${isOnline ? 'text-primary' : 'text-600'}`}>
          {isOnline ? 'En línea' : formatLastSeen(member.users.last_seen)}
        </p>
      </div>
    </div>
  );
};
