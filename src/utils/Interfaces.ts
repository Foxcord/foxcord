import { DiscordButton } from '../structures/DiscordButton';
import { DiscordSelectMenu } from '../structures/DiscordSelectMenu';

// CLIENT
export type DeviceType = 'MOBILE' | 'DESKTOP';

export type IntentsOptions =
  | 'ALL'
  | 'GUILD_MEMBERS'
  | 'GUILD_BANS'
  | 'GUILD_EMOJIS'
  | 'GUILD_INTEGRATIONS'
  | 'GUILD_WEBHOOKS'
  | 'GUILD_INVITES'
  | 'GUILD_VOICE_STATES'
  | 'GUILD_PRESENCES'
  | 'GUILD_MESSAGES'
  | 'GUILD_MESSAGE_REACTIONS'
  | 'GUILD_MESSAGE_TYPING'
  | 'DIRECT_MESSAGES'
  | 'DIRECT_MESSAGE_REACTIONS'
  | 'DIRECT_MESSAGE_TYPING';

export type GameType = 'PLAYING' | 'WATCHING' | 'STREAMING' | 'LISTENING' | 'COMPETING';

export type StatusType = 'ONLINE' | 'IDLE' | 'DND' | 'INVISIBLE';

export interface ClientGame {
  /**
   * The client game
   */
  name: string | undefined;

  /**
   * The client game URL *(url is required for streaming status)*
   */
  url?: string;

  /**
   * The client game type
   * @default 'PLAYING'
   */
  type?: number;
}

export interface GameOptions {
  /**
   * The client game URL *(url is required for streaming status)*
   */
  url?: string;

  /**
   * The client game type
   * @default 'PLAYING'
   */
  type?: GameType;
}

export interface ClientOptions {
  /**
   * The client device type
   * @default 'DESKTOP'
   */
  device?: DeviceType;

  /**
   * Client shards
   * @default 1
   * @deprecated
   */
  shards?: number;

  /**
   * If the client reconnect itself
   * @default false
   */
  reconnect?: boolean;

  /**
   * Compress
   * @default true
   */
  compress?: boolean;

  /**
   * Large threshold
   * @default 250
   */
  largeThreshold?: number;

  /**
   * Intents you may wanted
   * @default 'ALL'
   */
  intents?: IntentsOptions[];
}

// AVATAR URL
export type ImageSize = '128' | '256' | '512' | '1024' | '4096';

export type ImageFormat = 'jpg' | 'jpeg' | 'gif' | 'png' | 'tiff' | 'bmp';

export interface AvatarURL {
  /**
   * Image size
   * @default 128
   */
  size?: ImageSize;

  /**
   * Image format
   * @default 'png'
   */
  format?: ImageFormat;
}

// RESTMANAGER
export type MethodOptions = 'GET' | 'PATCH' | 'POST' | 'DELETE' | 'PUT';

export interface RestOptions {
  /**
   * Method
   */
  method?: MethodOptions;

  /**
   * Data
   */
  data?: object | any;

  /**
   * Client token?
   */
  token?: string;
}

// SLASHCOMMANDBUILDER
export interface SlashCommandChoices {
  /**
   * Choice name
   */
  name: string;

  /**
   * Choice value
   */
  value: string;
}

export interface SlashCommandOptions {
  /**
   * Options name
   */
  name: string;

  /**
   * Options description
   */
  description: string;

  /**
   * Options type (3)
   */
  type: number;

  /**
   * Required?
   */
  required: boolean;

  /**
   * Options choices
   */
  choices: SlashCommandChoices | SlashCommandChoices[];
}

export interface SlashCommand {
  /**
   * Command name
   */
  name: string;

  /**
   * Command type (1)
   */
  type: number;

  /**
   * Command description
   */
  description: string;

  /**
   * Command options https://discord.com/developers/docs/interactions/application-commands#slash-commands-example-slash-command
   */
  options: SlashCommandOptions | SlashCommandOptions[];
}

// SEND OPTIONS
export interface SendOptions {
  /**
   * Message button
   */
  button?: DiscordButton | DiscordButton[] | any;

  /**
   * Is the reply ephemeral
   */
  ephemeral?: boolean;

  /**
   * Select menu **(only 1)**
   */
  selectMenu?: DiscordSelectMenu;
}

export interface SendOptionsWithFile {
  /**
   * File or file array
   */
  files?: string | string[];

  /**
   * Button or button array
   */
  button?: DiscordButton | DiscordButton[] | any;

  /**
   * Discord select menu **(only 1)**
   */
  selectMenu?: DiscordSelectMenu;
}

// SLASHCOMMANDSMANAGER
export interface SlashCommandOptionsManager {
  /**
   * The guild ID
   */
  guildID?: string;
}

export interface SlashCommandOptionsWithId extends SlashCommandOptionsManager {
  /**
   * The command ID
   */
  commandID: string;
}

export interface PushLoadedOptions extends SlashCommandOptionsManager {
  /**
   * Push specific command and get it by nam
   */
  commandName?: string;

  /**
   * Push all commands (default)
   */
  all?: boolean;
}

// AUTHOR
export interface VoiceOptions {
  /**
   * Is the bot mute?
   * @default false
   */
  mute?: boolean;

  /**
   * Is the bot deaf?
   * @default false
   */
  deaf?: boolean;
}

export interface BannerOptions {
  /**
   * The banner format
   */
  type?: ImageFormat;

  /**
   * The banner size
   */
  size: ImageSize;
}

// BADGES
export type PremiumNames = 'none' | 'Nitro Classic' | 'Nitro';

// CHANNEL
export interface CollectorOptions {
  /**
   * Collector time **(in seconds)**
   */
  time?: number;
}

// EMOJIS
export interface EmojiOptions {
  /**
   * Emoji name
   */
  name?: string;

  /**
   * Emoji ID *(if custom only)*
   */
  id?: string;

  /**
   * Is the emoji animated?
   */
  animated?: boolean;
}

// DISCORDBUTTON
export type ButtonStyle = 'BLURPLE' | 'GREY' | 'GREEN' | 'RED' | 'URL';

// DISCORDEMBED
export interface AuthorOptions {
  /**
   * Author name
   */
  name?: string;

  /**
   * Author URL
   */
  url?: string;

  /**
   * Author icon URL
   */
  icon_url?: string;
}

export interface ThumbnailOptions {
  /**
   * Thumbnail URL
   */
  url?: string;

  /**
   * Thumbnail width
   */
  width?: number;

  /**
   * Thumbnail height
   */
  height?: number;
}

export interface ImageOptions {
  /**
   * Image URL
   */
  url?: string;

  /**
   * Image width
   */
  width?: number;

  /**
   * Image height
   */
  height?: number;
}

export interface FooterOptions {
  /**
   * Footer text
   */
  text?: string;

  /**
   * Footer icon URL
   */
  icon_url?: string;
}

export interface VideoOptions {
  /**
   * Video URL **(no YouTube or Dailymotion link, only `.mp4` link)**
   */
  url?: string;

  /**
   * Video width
   */
  width?: number;

  /**
   * Video height
   */
  height?: number;
}

export interface ProviderOptions {
  /**
   * Provider name
   */
  name?: string;

  /**
   * Provider URL
   */
  url?: string;
}

export type ColorOptions =
  | 'DEFAULT'
  | 'BLUE'
  | 'WHITE'
  | 'RED'
  | 'PURPLE'
  | 'BLACK'
  | 'MAGENTA'
  | 'GREY'
  | 'YELLOW'
  | 'PINK'
  | 'ORANGE'
  | 'NAVY'
  | 'GREEN'
  | 'AQUA';

// DISCORDSELECTMENU
export interface LabelOptions {
  /**
   * The label value
   */
  value: string;
  /**
   * The label description
   */
  description: string;
  /**
   * The label emoji
   */
  emoji?: EmojiOptions;
}

// MESSAGES
export interface MessageOptions {
  /**
   * The message channel ID
   */
  channelID: string | number;

  /**
   * The messge guild ID *(optional)*
   */
  guildID?: string;
}

// SENTMESSAGE + MESSAGE
export interface MessageOptionsEdit {
  /**
   * Button or button array
   */
  button?: DiscordButton | DiscordButton[];

  /**
   * Message menu (don't add a menu if the message already contains one)
   */
  selectMenu?: DiscordSelectMenu;
}

export type AutoArchiveDurationOptions = '60' | '1440' | '4320' | '10080';

export interface CreateThreadOptions {
  /**
   * Auto archive duration (24h by default)
   */
  autoArchiveDuration?: AutoArchiveDurationOptions;
}

export interface MessageMentions {
  /**
   * Mention member username
   */
  username: string;

  /**
   * Mention member id
   */
  id: string;

  /**
   * Mention member discriminator
   */
  discriminator: string;

  /**
   * Mention member avatar (not avatar URL)
   */
  avatar: string;
}

// MESSAGECOLLECTOR
export interface CreateCollectorOptions {
  /**
   * The collector channel ID
   */
  channelID: string;

  /**
   * Collector time **(in seconds)**
   */
  time?: number;
}

// GUILD
export interface GuildWelcomeScreen {
  /**
   * Guild welcome screen description
   */
  description: string;

  /**
   * Guild welcome channels
   */
  channels: GuildWelcomeChannels[] | [];
}

export interface ListGuildOptions {
  /**
   * Guild ID
   */
  id: string;

  /**
   * Guild name
   */
  name: string;
}

export interface GuildWelcomeChannels {
  /**
   * Welcome channel id
   */
  id: string;

  /**
   * Welcome channel description
   */
  description: string;
}

export type WidgetStyle = '0' | '1' | '2' | '3' | '4';

export interface WidgetStyleOptions {
  /**
   * Widget style
   */
  style: WidgetStyle;
}

// WEBHOOK
export interface WebhookOptions {
  /**
   * The webhook URL
   */
  url: string;

  /**
   * The webhook username *(username cannot be 'Clyde')*
   */
  username: string;

  /**
   * The webhook avatar URL *(no image file)*
   */
  avatarURL?: string;
}

export interface CreateWebhookOptions {
  /**
   * The webhook username *(username cannot be 'Clyde')*
   */
  username: string;

  /**
   * The webhook avatar URL *(no image file)*
   */
  avatarURL?: string;
}
