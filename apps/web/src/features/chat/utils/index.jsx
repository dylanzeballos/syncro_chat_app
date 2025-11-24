export  const formatLastSeen = (lastSeen) => {
   if (!lastSeen) return 'Desconectado';

   const date = new Date(lastSeen);
   const now = new Date();
   const diffMs = now - date;
   const diffMinutes = Math.floor(diffMs / 60000);
   const diffHours = Math.floor(diffMinutes / 60);
   const diffDays = Math.floor(diffHours / 24);

   if (diffMinutes < 1) return 'Hace un momento';
   if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
   if (diffHours < 24) return `Hace ${diffHours}h`;
   if (diffDays < 7) return `Hace ${diffDays}d`;
   return date.toLocaleDateString();
 };
