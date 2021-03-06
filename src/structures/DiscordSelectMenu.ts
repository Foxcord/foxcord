import { LabelOptions } from '../utils/Interfaces';

/**
 * @class
 * Class symbolizing a `DiscordSelectMenu`
 */
export class DiscordSelectMenu {
  /**
   * The menu custom ID
   */
  public customID!: string;

  /**
   * The menu options
   */
  public options!: any[];

  /**
   * The menu place holder
   */
  public placeHolder!: string;

  /**
   * The menu max values
   */
  public maxValues!: number;

  /**
   * The menu min values
   */
  public minValues!: number;

  constructor() {
    this.options = [];
  }

  /**
   * Add a menu label
   * @param {string} label
   * @param {LabelOptions} options
   * @returns {DiscordSelectMenu}
   * @example new DiscordSelectMenu().addLabel('Label', { description: 'Some description', value: 'label' })
   */
  public addLabel(Label: string, options: LabelOptions): DiscordSelectMenu {
    if (!Label || typeof Label !== 'string') throw new SyntaxError('[DISCORD-SELECT-MENU] No label provided');
    if (!options || typeof options !== 'object') throw new SyntaxError('[DISCORD-SELECT-MENU] Invalid label options');
    this.options.push({
      label: Label,
      value: options.value,
      description: options.description,
      emoji: options.emoji !== undefined ? { name: options.emoji.name, id: options.emoji.id } : undefined,
    });
    return this;
  }

  /**
   * Set the menu custom ID
   * @param {string} id
   * @returns {DiscordSelectMenu}
   * @example new DiscordSelectMenu().setCustomID('some-id-without-spaces')
   */
  public setCustomID(id: string): DiscordSelectMenu {
    if (!id || typeof id !== 'string' || id.indexOf(' ') >= 0)
      throw new SyntaxError('[DISCORD-SELECT-MENU] No custom id provided');
    this.customID = id;
    return this;
  }

  /**
   * Set the menu place holder
   * @param {string} placeHolder
   * @returns {DiscordSelectMenu}
   * @example new DiscordSelectMenu().setPlaceHolder('cool-placeholder-without-spaces')
   */
  public setPlaceHolder(placeHolder: string): DiscordSelectMenu {
    if (!placeHolder || typeof placeHolder !== 'string')
      throw new SyntaxError('[DISCORD-SELECT-MENU] No place holder provided');
    this.placeHolder = placeHolder;
    return this;
  }

  /**
   * Set the menu min values
   * @param {number} value
   * @returns {DiscordSelectMenu}
   * @example new DiscordSelectMenu().setMinValues(1);
   */
  public setMinValues(value: number): DiscordSelectMenu {
    if (!value || typeof value !== 'number') throw new SyntaxError('[DISCORD-SELECT-MENU] No min value provided');
    this.minValues = value;
    return this;
  }

  /**
   * Set the menu max values
   * @param {number} value Up to **`25`**
   * @returns {DiscordSelectMenu}
   * @example new DiscordSelectMenu().setMaxValues(3);
   */
  public setMaxValues(value: number): DiscordSelectMenu {
    if (!value || typeof value !== 'number') throw new SyntaxError('[DISCORD-SELECT-MENU] No max value provided');
    this.maxValues = value;
    return this;
  }

  /**
   * Return the menu JSON object
   * @returns {object}
   */
  public getJSON(): object {
    if (
      this.customID &&
      typeof this.customID === 'string' &&
      this.options !== undefined &&
      typeof this.options === 'object'
    ) {
      return {
        type: 3,
        custom_id: this.customID,
        options: this.options,
        placeholder: this.placeHolder,
        min_values: this.minValues === undefined ? 1 : this.minValues,
        max_values: this.maxValues === undefined ? Object.keys(this.options).length : this.maxValues,
      };
    }
    throw new Error('INVALID_MENU');
  }
}
