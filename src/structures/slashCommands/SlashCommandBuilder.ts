interface SlashCommandOptions {
  /**
   * The command option name
   */
  name: string;

  /**
   * The command option description
   */
  description: string;
}

interface SlashCommandChoices {
  /**
   * Command name
   */
  name: string;

  /**
   * Command value
   */
  value: string;
}

interface SlashCommandOptionsBuilder {
  /**
   * Command name
   */
  name: string;

  /**
   * Command description
   */
  description: string;

  /**
   * Command options
   */
  options: SlashCommandOptionsBuilderOptions;
}

interface SlashCommandOptionsBuilderOptions {
  /**
   * Command options name
   */
  name: string;

  /**
   * Command options description
   */
  description: string;

  /**
   * Command type
   */
  type: number;

  /**
   * Are the options required ?
   */
  required: boolean;

  /**
   * Command choices {@link https://www.discord.com/developers/docs/interactions/slash-commands}
   */
  choices?: any;
}

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
   * The command type
   * @default 3
   */
  public type?: number;

  /**
   * Required options
   * @default false
   */
  public required?: boolean;

  /**
   * Slash command options
   */
  public options?: SlashCommandOptions | any;

  /**
   * Slash command choices
   */
  public choices?: SlashCommandChoices | any;

  private constructorBuilder?: object;

  /**
   * Create a new SlashCommandBuilder
   * @constructor
   */
  constructor(command?: SlashCommandOptionsBuilder) {
    if (
      command &&
      typeof command === 'object' &&
      command.name &&
      command.description &&
      typeof command.name === 'string' &&
      typeof command.description === 'string'
    ) {
      this.constructorBuilder = command;
    } else {
      this.name = undefined;
      this.description = undefined;
      this.type = 3;
      this.required = false;
      this.options = {};
      this.choices = {};
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
    if (!name || typeof name !== 'string') throw new SyntaxError('NO_NAME_PROVIDED_OR_INVALID_NAME');
    if (name.indexOf(' ') >= 0) throw new SyntaxError('NAME_CONTAINS_SPACE');
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
      throw new SyntaxError('NO_DESCRIPTION_PROVIDED_OR_INVALID_DESCRIPTIOn');
    this.description = description;
    return this;
  }

  /**
   * Set the SlashCommand type
   * @param {number} type Default = 3
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setType(3);
   */
  public setType(type: number): SlashCommandBuilder {
    if (!type || typeof type !== 'number') throw new SyntaxError('NO_TYPE_PROVIDED_OR_INVALID_TYPE');
    this.type = type;
    return this;
  }

  /**
   * Set the SlashCommand required option
   * @param {boolean} required No options = false;
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setRequired(true)
   */
  public setRequired(required: boolean): SlashCommandBuilder {
    this.required = required && typeof required === 'boolean' ? required : false;
    return this;
  }

  /**
   * Set the SlashCommand choices
   * @param {SlashCommandChoices} choices
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setChoices({ name: 'some-name-without-spaces', value: 'some value' });
   */
  public setChoices(choices: SlashCommandChoices): SlashCommandBuilder {
    if (!choices || typeof choices !== 'object') throw new SyntaxError('NO_CHOICE_PROVIDED_OR_INVALID_CHOICE');
    this.choices = choices;
    return this;
  }

  /**
   * Set the SlashCommand options
   * @param {SlashCommandOptions} options
   * @returns {SlashCommandBuilder}
   * @example
   * new SlashCommandBuilder().setOptions({ name: 'some-value-without-spaces', description: 'some description'})
   */
  public setOptions(options: SlashCommandOptions): SlashCommandBuilder {
    if (!options || typeof options !== 'object') throw new SyntaxError('NO_OPTION_PROVIDED_OR_INVALID_OPTION');
    this.options = options;
    return this;
  }

  /**
   * Get the SlashCommand JSON formatted object
   * @returns {object}
   */
  getJSON(): object {
    if (!this.name || !this.description || typeof this.name !== 'string' || typeof this.description !== 'string')
      throw new SyntaxError('INVALID_SLASH_COMMAND');
    if (this.constructorBuilder !== undefined) {
      return this.constructorBuilder;
    }
    return {
      name: this.name,
      description: this.description,
      options: [
        {
          name: this.options.name || this.name,
          description: this.options.description || this.description,
          type: this.type,
          required: this.required,
        },
      ],
    };
  }
}
