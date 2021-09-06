import { Member } from '../structures/Member';
import { EmojiOptions } from '../utils/Interfaces';

/**
 * Class symbolizing a `MessageReaction`
 * @class
 */
export class MessageReaction {
  /**
   * The user iD
   */
  public userID!: string;

  /**
   * The message ID
   */
  public messageID!: string;

  /**
   * The emoji
   */
  public emoji!: EmojiOptions;

  /**
   * The channel ID
   */
  public channelID!: string;

  /**
   * The guild ID
   */
  public guildID!: string;

  /**
   * The member
   */
  public member!: Member;

  private _token: string;

  /**
   * Create a new MessageReaction
   * @param {object} data
   * @constructor
   */
  constructor(data: object, token: string) {
    this._token = token;
    this._patchData(data);
  }

  /**
   * @ignore
   * @private
   * @param {any} data
   * @returns {void}
   */
  private _patchData(data: any): void {
    this.userID = data.user_id;
    this.messageID = data.message_id;
    this.emoji = {
      name: data.emoji.name,
      id: data.emoji.id,
    };
    this.channelID = data.channel_id;
    this.guildID = data.guild_id;
    this.member = new Member(data.member, this._token, this.guildID);
  }
}
