import { SlashCommand, SlashCommandOptions } from '../../utils/Interfaces';

/**
 * Class symbolizing a `SlashCommandBuilder`
 */
export class SlashCommandBuilder {
  /**
   * The command name
   */
  public name?: string;

  /**
   * The command description
   */
  public description?: string;

  /**
   * Slash command options
   */
  public options?: object | any;

  private constructorBuilder?: object;

  /**
   * Create a new SlashCommandBuilder
   * @param {SlashCommand} command
   * @constructor
   * @example
   * const mySlashCommand = new SlashCommandBuilder({
   *    name: 'blep',
   *    description: 'Send a random adorable animal photo',
   *    type: 1,
   *    options: [
   *        {
   *           name: 'animal',
   *           description: 'The type of animal',
   *           type: 3,
   *           required: true,
   *           choices: [
   *             {
   *                 name: 'Dog',
   *                 value: 'animal_dog'
   *             },
   *             {
   *                 name: 'Cat',
   *                 value: 'animal_cat'
   *             },
   *             {
   *                 name: 'Penguin',
   *                 value: 'animal_penguin'
   *             }
   *         ]
   *      }
   *    ]
   * });
   */
  constructor(command?: SlashCommand) {
    if (
      command &&
      typeof command === 'object' &&
      command.name &&
      command.description &&
      typeof command.name === 'string' &&
      typeof command.description === 'string'
    ) {
      this.name = command.name;
      this.description = command.description;
      this.options = command.options;
      this.constructorBuilder = command;
    } else {
      this.name = undefined;
      this.description = undefined;
      this.options = undefined;
      this.constructorBuilder = undefined;
    }
  }

  /**
   * Set the SlashCommand name
   * @param {string} name
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setName('some-cool-name-without-spaces');
   */
  public setName(name: string): SlashCommandBuilder {
    if (!name || typeof name !== 'string') throw new SyntaxError('[SLASH-COMMAND-BUILDER] No name provided');
    if (name.indexOf(' ') >= 0) throw new SyntaxError('[SLASH-COMMAND-BUILDER] Name contains space');
    this.name = name;
    return this;
  }

  /**
   * Set the SlashCommand description
   * @param {string} description
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setDescription('Some description');
   */
  public setDescription(description: string): SlashCommandBuilder {
    if (!description || typeof description !== 'string')
      throw new SyntaxError('[SLASH-COMMAND-BUILDER] No descroption provided');
    this.description = description;
    return this;
  }

  /**
   * Set the SlashCommand options
   * @param {SlashCommandOptions | SlashCommandOptions[] | object | object[] | any | any[]} options
   * @returns {SlashCommandBuilder}
   */
  public setOptions(
    options: SlashCommandOptions | SlashCommandOptions[] | object | object[] | any | any[],
  ): SlashCommandBuilder {
    if (!options) throw new SyntaxError('[SLASH-COMMAND-BUILDER] No options provided');
    this.options = options;
    return this;
  }

  /**
   * Get the SlashCommand JSON formatted object
   * @returns {object}
   */
  getJSON(): object {
    if (!this.name || !this.description || typeof this.name !== 'string' || typeof this.description !== 'string')
      throw new SyntaxError('[SLASH-COMMAND-BUILDER] Invalid slash command');
    if (this.constructorBuilder !== undefined) {
      return this.constructorBuilder;
    }
    return {
      name: this.name,
      type: 1,
      description: this.description,
      options: [this.options],
    };
  }
}
