import { Member } from '../Member';
import { RestManager } from '../../rest/RestManager';
import { DiscordEmbed } from '../DiscordEmbed';
import { DISCORD_API } from '../../utils/Constants';
import { SendOptions } from '../../utils/Interfaces';

/**
 * Class symbolizing a `SlashCommandInteraction`
 * @class
 */
export class SlashCommandInteraction {
  /**
   * The command ID
   */
  public id!: string;

  /**
   * The guild ID
   */
  public guildID!: string;

  /**
   * The command name
   */
  public name!: string;

  /**
   * The command data ID
   */
  public dataID!: string;

  /**
   * The command channel ID
   */
  public channelID!: string;

  /**
   * The command application ID
   */
  public applicationID!: string;

  /**
   * The command token (be careful)
   */
  public token!: string;

  /**
   * The command member
   */
  public member!: Member;

  private _token: string;

  /**
   * Create a new SlashCommandInteraction
   * @param {object|any} messageData
   * @param {string} token
   */
  constructor(messageData: object | any, token: string) {
    this._token = token;
    this._patchData(messageData);
  }

  /**
   * Reply to a slash command
   * @param {string|number|DiscordEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async reply(message: string | number | DiscordEmbed, options?: SendOptions): Promise<void> {
    if (!message) throw new SyntaxError('[SLASH-COMMAND-INTERACTION] No message provided');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
      flags: options?.ephemeral ? 64 : null,
    };
    switch (typeof message) {
      case 'string':
        payload.content = message;
        break;
      case 'number':
        payload.content = String(message);
        break;
      case 'object':
        try {
          payload.embeds = [message.getJSON()];
        } catch (err) {
          throw new Error('[SLASH-COMMAND-INTERACTION] Invalid embed');
        }
        break;
      default:
        throw new Error('[SLASH-COMMAND-INTERACTION] Invalid content');
    }
    if (options?.button && options.selectMenu) throw new SyntaxError('[SLASH-COMMAND-INTERACTION] Too many components');
    if (options?.button) {
      payload.components = [
        {
          type: 1,
          components: Array.isArray(options.button)
            ? options.button.map((btn) => btn.getJSON())
            : [options.button.getJSON()],
        },
      ];
    }
    if (options?.selectMenu) {
      if (Array.isArray(options.selectMenu)) throw new SyntaxError('[SLASH-COMMAND-INTERACTION] Select menu is array');
      payload.components = [
        {
          type: 1,
          components: [options.selectMenu.getJSON()],
        },
      ];
    }
    await RestManager.prototype.REQUEST(`${DISCORD_API}interactions/${this.id}/${this.token}/callback`, {
      token: this._token,
      data: JSON.stringify({ type: 4, data: payload }),
    });
    return;
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.id = data.id;
    this.guildID = data.guild_id;
    this.name = data.data.name;
    this.dataID = data.data.id;
    this.channelID = data.channel_id;
    this.applicationID = data.application_id;
    this.token = data.token;
    this.member = new Member(data.member, this._token, this.guildID);
  }
}
