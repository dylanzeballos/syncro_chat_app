// WebSocket Event Types
export const WS_EVENTS = {
  // Client -> Server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Server -> Client
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  NEW_MESSAGE: 'new_message',
  USER_TYPING: 'user_typing',
  ERROR: 'error',
  CONNECTED: 'connected',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
};

export const VALIDATION = {
  MESSAGE_MAX_LENGTH: 5000,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  ROOM_NAME_MAX_LENGTH: 50,
};
