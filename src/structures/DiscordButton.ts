import { _isEmoji, _testURL } from '../utils/Utils';
import { buttonStyles } from '../utils/Constants';

type buttonStyle = 'BLURPLE' | 'GREY' | 'GREEN' | 'RED' | 'URL';

interface EmojiOptions {
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

/**
 * Class symbolizing a `DiscordButton`
 * @class
 */
export class DiscordButton {
  /**
   * The button type
   * @default 2
   */
  public type: number;

  /**
   * If the button is disabled or not
   * @default false
   */
  public disable?: boolean;

  /**
   * The button style
   * @default 1
   */
  public style?: buttonStyle | number;

  /**
   * The button label
   */
  public label: string | any;

  /**
   * The button emoji
   */
  public emoji?: EmojiOptions;

  /**
   * The button custom ID
   */
  public customID?: string;

  /**
   * The button URL
   */
  public URL?: string;

  /**
   * @constructor
   * Create a new DiscordButton
   */
  constructor() {
    this.type = 2;
    this.disable = false;
    this.style = 1;
    this.label = undefined;
    this.emoji = undefined;
    this.customID = undefined;
    this.URL = undefined;
  }

  /**
   * Set the button label
   * @param {string} label
   * @returns {DiscordButton}
   * @example
   * new DiscordButton().setLabel('Some label');
   */
  setLabel(label: string): DiscordButton {
    if (!label || label.length > 80) throw new SyntaxError('INVALID_LABEL_OR_NO_LABEL_PROVIDED');
    this.label = label;
    return this;
  }

  /**
   * Set the button style.
   * Available styles:
   * * BLURPLE (1)
   * * GREY (2)
   * * GREEN (3)
   * * RED (4)
   * * URL (5)
   * @param {buttonStyle|number} style
   * @returns {DiscordButton}
   * @default 1
   * @example
   * new DiscordButton().setStyle('GREEN');
   * // Or using number
   * new DiscordButton().setStyle(3);
   */
  setStyle(style?: buttonStyle | number): DiscordButton {
    if (!style) this.style = 1;
    else {
      const btnStyle = buttonStyles.find((elm) => elm.color === style || elm.number === style);
      if (!btnStyle) throw new SyntaxError('INVALID_STYLE');
      this.style = btnStyle.number;
    }
    return this;
  }

  /**
   * Set the button emoji
   * @param {string} emoji
   * @returns {DiscordButton}
   * @example
   * new DiscordButton().setEmoji('👌');
   */
  setEmoji(emoji: string): DiscordButton {
    if (!emoji || !_isEmoji(emoji)) throw new SyntaxError('NO_EMOJI_PROVIDED_OR_INVALID_EMOJI');
    this.emoji = {};
    this.emoji.name = emoji;
    return this;
  }

  /**
   * Set the button id
   * @param id
   * @returns {DiscordButton}
   * @example
   * new DiscordButton().setID('some_id_using_underscores');
   */
  setID(id: string): DiscordButton {
    if (!id || id.length > 100) throw new SyntaxError('NO_ID_PROVIDED_OR_INVALID_ID');
    this.customID = id;
    return this;
  }

  /**
   * Set the button URL. *The button style must be `URL (5)`*
   * @param {string} url
   * @returns {DiscordButton}
   * @example
   * new DiscordButton().setURL('valid URL');
   */
  setURL(url: string): DiscordButton {
    if (this.style !== 5) throw new SyntaxError('STYLE_MUST_BE_5');
    if (!url || !_testURL(url)) throw new SyntaxError('NO_URL_PROVIDED_OR_INVALID_URL');
    this.URL = url;
    return this;
  }

  /**
   * Set the disable parameter. *The button style must not be `URL (5)`*
   * @param {boolean} state
   * @returns {DiscordButton}
   * @example new DiscordButton().setDisable(false);
   */
  setDisable(state?: boolean): DiscordButton {
    if (this.style === 5) throw new SyntaxError('STYLE_IS_5');
    if (!state) {
      this.disable = true;
    } else {
      this.disable = state;
    }
    return this;
  }

  /**
   * Get the json content of the button
   * @returns {Object}
   * @example new DiscordButton().getJson()
   */
  getJSON(): object {
    if (!this.customID) throw new SyntaxError('CUSTOM_ID_IS_REQUIRED');
    return {
      type: this.type,
      label: this.label,
      style: this.style,
      custom_id: this.customID,
      emoji: this.emoji,
      disable: this.disable,
      url: this.URL,
    };
  }
}
