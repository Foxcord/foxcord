/**
 * Class symbolizing a `SlashCommand`
 * @class
 */
export class SlashCommand {
  /**
   * The command ID
   */
  public id: string;

  /**
   * The command application ID
   */
  public applicationID: string;

  /**
   * The command name
   */
  public name: string;

  /**
   * The command description
   */
  public description: string;

  /**
   * The command version (id)
   */
  public version: string;

  /**
   * Command permission is default ?
   */
  public defaultPermission: boolean;

  /**
   * The command guild ID
   */
  public guildID: string | undefined;

  /**
   * Create a new SlashCommand
   * @param {object|any} messageData
   * @constructor
   */
  constructor(messageData: object | any) {
    const parsedData: any = JSON.parse(messageData);
    this.id = parsedData.id;
    this.applicationID = parsedData.application_id;
    this.name = parsedData.name;
    this.description = parsedData.description;
    this.version = parsedData.version;
    this.defaultPermission = parsedData.default_permission;
    this.guildID =
      parsedData.guild_id && parsedData.guild_id !== undefined && typeof parsedData.guild_id === 'string'
        ? parsedData.guild_id
        : undefined;
  }
}
