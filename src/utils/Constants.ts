// ENDPOINTS
export const DISCORD_CDN = 'https://cdn.discordapp.com/';
export const WEBSOCKET_URL = 'wss://gateway.discord.gg/?v=9&encoding=json';
export const DISCORD_API = 'https://discord.com/api/v9/';

// GATEWAY OPCODES
export enum GATEWAY_OPCODES {
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  RECONNECT = 7,
  REQUEST_GUILD_MEMBERS = 8,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}

// GATEWAY CLOSE EVENT CODES
export enum gatewayCloseEventCodes {
  UNKNOWN_ERROR = 4000,
  UNKNOWN_OPCODE = 4001,
  DECODE_ERROR = 4002,
  NOT_AUTHENTICATED = 4003,
  AUTHENTICATION_FAILED = 4004,
  ALREADY_AUTHENTICATED = 4005,
  INVALID = 4007,
  RATE_MIMITED = 4008,
  SESSION_TIMED_OUT = 4009,
  INVALID_SHARD = 4010,
  SHARDING_REQUIRED = 4011,
  INVALID_API_VERSION = 4012,
  INVALID_INTENTS = 4013,
  DISALLOWED_INTENTS = 4014,
}

// HTTP RESPONSE CODES
export enum httpResponseCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  TOO_MANY_REQUESTS = 429,
  GATEWAY_UNAVAILABLE = 502,
  SERVER_ERROR = '5xx',
}

// BUTTON STYLES
export const buttonStyles = [
  { color: 'BLURPLE', number: 1 },
  { color: 'GREY', number: 2 },
  { color: 'GREEN', number: 3 },
  { color: 'RED', number: 4 },
  { color: 'URL', number: 5 },
];

// COLORS CODE
export const Colors = [
  { color: 'DEFAULT', code: 0x000000 },
  { color: 'BLUE', code: 0x0590ed },
  { color: 'WHITE', code: 0xffffff },
  { color: 'RED', code: 0xe30202 },
  { color: 'PURPLE', code: 0x7c02f5 },
  { color: 'BLACK', code: 0x000000 },
  { color: 'MAGENTA', code: 0xb31d79 },
  { color: 'GREY', code: 0x727375 },
  { color: 'YELLOW', code: 0xf5ed00 },
  { color: 'PINK', code: 0xfa00b7 },
  { color: 'ORANGE', code: 0xfa7500 },
  { color: 'NAVY', code: 0x0a0763 },
  { color: 'GREEN', code: 0x00c925 },
  { color: 'AQUA', code: 0x00f7ef },
];

// CONSOLE STYLE
export enum consoleColors {
  Black = '\x1b[30m',
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Blue = '\x1b[34m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  White = '\x1b[37m',
}

export enum consoleBackgrounds {
  Black = '\x1b[40m',
  Red = '\x1b[41m',
  Green = '\x1b[42m',
  Yellow = '\x1b[43m',
  Blue = '\x1b[44m',
  Magenta = '\x1b[45m',
  Cyan = '\x1b[46m',
  White = '\x1b[47m',
}

export enum consoleStyles {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',
}

// IMAGE FORMAT
export const imageFormat: string[] = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'];

// IMAGE SIZE
export const imageSize: number[] = [128, 256, 512, 1024, 4096];

// DEVICE TYPE
export const deviceType: string[] = ['DESKTOP', 'MOBILE'];

// GAME TYPE
export const gameType: string[] = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'];

export const numberGameType = [
  { type: 'PLAYING', number: 0 },
  { type: 'STREAMING', number: 1 },
  { type: 'LISTENING', number: 2 },
  { type: 'WATCHING', number: 3 },
  { type: 'COMPETING', number: 5 },
];

// STATUS TYPE
export const statusType: string[] = ['ONLINE', 'IDLE', 'DND', 'INVISIBLE'];

// INTENTS
export const INTENTS_ARRAY = [
  { intent: 'GUILDS', number: 1 << 0 },
  { intent: 'GUILD_MEMBERS', number: 1 << 1 },
  { intent: 'GUILD_BANS', number: 1 << 2 },
  { intent: 'GUILD_EMOJIS', number: 1 << 3 },
  { intent: 'GUILD_INTEGRATIONS', number: 1 << 4 },
  { intent: 'GUILD_WEBHOOKS', number: 1 << 5 },
  { intent: 'GUILD_INVITES', number: 1 << 6 },
  { intent: 'GUILD_VOICE_STATES', number: 1 << 7 },
  { intent: 'GUILD_PRESENCES', number: 1 << 8 },
  { intent: 'GUILD_MESSAGES', number: 1 << 9 },
  { intent: 'GUILD_MESSAGE_REACTIONS', number: 1 << 10 },
  { intent: 'GUILD_MESSAGE_TYPING', number: 1 << 11 },
  { intent: 'DIRECT_MESSAGES', number: 1 << 12 },
  { intent: 'DIRECT_MESSAGE_REACTIONS', number: 1 << 13 },
  { intent: 'DIRECT_MESSAGE_TYPING', number: 1 << 14 },
];

export enum GATEWAY_EVENTS {
  HELLO = 'HELLO',
  READY = 'READY',
  RESUMED = 'RESUMED',
  RECONNECT = 'RECONNECT',
  INVALID_SESSION = 'INVALID_SESSION',
  APPLICATION_COMMAND_CREATE = 'APPLICATION_COMMAND_CREATE',
  APPLICATION_COMMAND_UPDATE = 'APPLICATION_COMMAND_UPDATE',
  APPLICATION_COMMAND_DELETE = 'APPLICATION_COMMAND_DELETE',
  CHANNEL_CREATE = 'CHANNEL_CREATE',
  CHANNEL_UPDATE = 'CHANNEL_UPDATE',
  CHANNEL_DELETE = 'CHANNEL_DELETE',
  CHANNEL_PINS_UPDATE = 'CHANNEL_PINS_UPDATE',
  THREAD_CREATE = 'THREAD_CREATE',
  THREAD_UPDATE = 'THREAD_UPDATE',
  THREAD_DELETE = 'THREAD_DELETE',
  THREAD_LIST_SYNC = 'THREAD_LIST_SYNC',
  THREAD_MEMBER_UPDATE = 'THREAD_MEMBER_UPDATE',
  THREAD_MEMBERS_UPDATE = 'THREAD_MEMBERS_UPDATE',
  GUILD_CREATE = 'GUILD-CREATE',
  GUILD_UPDATE = 'GUILD_UPDATE',
  GUILD_DELETE = 'GUILD_DELETE',
  GUILD_BAN_ADD = 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE = 'GUILD_BAN_REMOVE',
  GUILD_MEMBER_UPDATE = 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK = 'GUILD_MEMBERS_CHUNK',
  GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD',
  GUILD_ROLE_CREATE = 'GUILD_ROLE_CREATE',
  GUILD_ROLE_UPDATE = 'GUILD_ROLE_UPDATE',
  GUILD_ROLE_DELETE = 'GUILD_ROLE_DELETE',
  INTEGRATION_CREATE = 'INTEGRATION_CREATE',
  INTEGRATION_UPDATE = 'INTEGRATION_UPDATE',
  INTEGRATION_DELETE = 'INTEGRATION_DELETE',
  INTERACTION_CREATE = 'INTERACTION_CREATE',
  INVITE_CREATE = 'INVITE_CREATE',
  INVITE_DELETE = 'INVITE_DELETE',
  MESSAGE_CREATE = 'MESSAGE_CREATE',
  MESSAGE_UPDATE = 'MESSAGE_UPDATE',
  MESSAGE_DELETE = 'MESSAGE_DELETE',
  MESSAGE_DELETE_BULK = 'MESSAGE_DELETE_BULK',
  MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD',
  MESSAGE_REACTION_REMOVE = 'MESSAGE_REACTION_REMOVE',
  MESSAGE_REACTION_REMOVE_ALL = 'MESSAGE_REACTION_REMOVE_ALL',
  MESSAGE_REACTION_REMOVE_EMOJI = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  STAGE_INSTANCE_CREATE = 'STAGE_INSTANCE_CREATE',
  STAGE_INSTANCE_DELETE = 'STAGE_INSTANCE_DELETE',
  STAGE_INSTANCE_UPDATE = 'STAGE_INSTANCE_UPDATE',
  TYPING_START = 'TYPING_START',
  USER_UPDATE = 'USER_UPDATE',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  VOICE_SERVER_UPDATE = 'VOICE_SERVER_UPDATE',
  WEBHOOKS_UPDATE = 'WEBHOOKS_UPDATE',
}

// BADGES
export const USER_FLAGS = [
  { flag: 'Discord Employee', number: 0 },
  { flag: 'Partnered Server Owner', number: 1 },
  { flag: 'HypeSquad Events', number: 2 },
  { flag: 'Bug Hunter Level 1', number: 3 },
  { flag: 'House Bravery', number: 6 },
  { flag: 'House Brilliance', number: 7 },
  { flag: 'House Balance', number: 8 },
  { flag: 'Early Supporter', number: 9 },
  { flag: 'Team User', number: 10 },
  { flag: 'Bug Hunter Level 2', number: 14 },
  { flag: 'Verified Bot', number: 16 },
  { flag: 'Early Verified Bot Developer', number: 17 },
  { flag: 'Discord Certified Moderator', number: 18 },
];

// CLIENT EVENTS
export enum CLIENT_EVENTS {
  MESSAGE = 'MESSAGE',
  BUTTON_CLICKED = 'BUTTON_CLICKED',
  SLASH_COMMAND_USED = 'SLASH_COMMAND_USED',
  SELECT_MENU_CLICKED = 'SELECT_MENU_CLICKED',
  GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD',
  READY = 'READY',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
  WARN = 'WARN',
  MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD',
}

// COLLECTOR EVENTS
export enum COLLECTOR_EVENTS {
  END = 'END',
  COLLECTED = 'COLLECTED',
}

// WEBSOCKET CLOSE CODES
export let WEBSOCKET_CLOSE_CODES = {
  '1000': 'Normal Closure',
  '1001': 'Going Away',
  '1002': 'Protocol Error',
  '1003': 'Unsupported Data',
  '1004': '(For future)',
  '1005': 'No Status Received',
  '1006': 'Abnormal Closure',
  '1007': 'Invalid frame payload data',
  '1008': 'Policy Violation',
  '1009': 'Message too big',
  '1010': 'Missing Extension',
  '1011': 'Internal Error',
  '1012': 'Service Restart',
  '1013': 'Try Again Later',
  '1014': 'Bad Gateway',
  '1015': 'TLS Handshake',
} as any;

// VOICE OPCODES
export enum VOICE_OPCODES {
  IDENTIFY = 0,
  SELECT_PROTOCOL = 1,
  READY = 2,
  HEARTBEAT = 3,
  SESSION_DESCRIPTION = 4,
  SPEAKING = 5,
  HEARTBEAT_ACK = 6,
  RESUME = 7,
  HELLO = 8,
  RESUMED = 9,
  CLIENT_DISCONNECT = 13,
}

// WEBSOCKET EVENTS
export enum WEBSOCKET_EVENTS {
  MESSAGE = 'message',
  OPEN = 'open',
  CLOSE = 'close',
  ERROR = 'error',
  PONG = 'pong',
}
