import { _testURL, _formatColor } from '../utils/Utils';
import { Colors } from '../utils/Constants';
import {
  FooterOptions,
  ImageOptions,
  ThumbnailOptions,
  VideoOptions,
  ProviderOptions,
  AuthorOptions,
  ColorOptions,
} from '../utils/Interfaces';

/**
 * Class symbolizing a `DiscordEmbed`
 * @class
 */
export class DiscordEmbed {
  /**
   * The embed title
   */
  public title?: string;

  /**
   * The embed description
   */
  public description?: string;

  /**
   * The embed URL
   */
  public url?: string;

  /**
   * The embed timestamp
   */
  public timestamp?: Date;

  /**
   * The embed color
   */
  public color?: string | number;

  /**
   * The embed footer
   */
  public footer?: FooterOptions;

  /**
   * The embed image
   */
  public image?: ImageOptions;

  /**
   * The embed thumbnail
   */
  public thumbnail?: ThumbnailOptions;

  /**
   * The embed video
   */
  public video?: VideoOptions;

  /**
   * The embed provider
   * @deprecated
   */
  public provider?: ProviderOptions;

  /**
   * The embed author
   */
  public author?: AuthorOptions;

  /**
   * Embed fields
   */
  public fields?: any;

  /**
   * @constructor
   * Create a new DiscordEmbed
   */
  constructor() {
    this.title = undefined;
    this.description = undefined;
    this.url = undefined;
    this.timestamp = undefined;
    this.color = undefined;
    this.footer = undefined;
    this.image = undefined;
    this.thumbnail = undefined;
    this.video = undefined;
    this.provider = undefined;
    this.author = undefined;
    this.fields = undefined;
  }

  /**
   * Set the embed author
   * @param {string} author
   * @param {string} image URL
   * @param {string} url
   * @returns {DiscordEmbed}
   */
  setAuthor(author: string, image?: string, url?: string): DiscordEmbed {
    if (!author || typeof author !== 'string') throw new SyntaxError('[DISCORD-EMBED] No author provided');
    this.author = {};
    this.author.name = author;
    this.author.url = url && _testURL(url) ? url : undefined;
    this.author.icon_url = image && typeof image === 'string' && _testURL(image) ? image : undefined;
    return this;
  }

  /**
   * Set the embed title
   * @param {string} title
   * @returns {DiscordEmbed}
   */
  setTitle(title: string): DiscordEmbed {
    if (!title || typeof title !== 'string') throw new SyntaxError('[DISCORD-EMBED] No title provided');
    this.title = title;
    return this;
  }

  /**
   * Set the embed URL
   * @param {string} url
   * @returns {DiscordEmbed}
   */
  setURL(url: string): DiscordEmbed {
    if (!url || !_testURL(url)) throw new SyntaxError('[DISCORD-EMBED] No url provided');
    this.url = url;
    return this;
  }

  /**
   * Set the embed thumbnail
   * @param {string} thumbnail URL
   * @returns {DiscordEmbed}
   */
  setThumbnail(thumbnail: string | undefined): DiscordEmbed {
    this.thumbnail = {};
    this.thumbnail.url = thumbnail && _testURL(thumbnail) ? thumbnail : undefined;
    return this;
  }

  /**
   * Set the embed image
   * @param {string} image URL
   * @returns {DiscordEmbed}
   */
  setImage(image: string): DiscordEmbed {
    if (!image || !_testURL(image)) throw new SyntaxError('[DISCORD-EMBED] No image url provided');
    this.image = {};
    this.image.url = image;
    return this;
  }

  /**
   * Set the embed timestamp
   * @param {Date} date
   * @returns {DiscordEmbed}
   */
  setTimestamp(date?: Date): DiscordEmbed {
    if (date) {
      this.timestamp = date;
    } else {
      this.timestamp = new Date();
    }
    return this;
  }

  /**
   * Set the embed color
   * @param {string} color Hex color
   * @returns {DiscordEmbed}
   */
  setColor(color: string): DiscordEmbed {
    if (!color || typeof color !== 'string') throw new SyntaxError('[DISCORD-EMBED] No color provided');
    this.color = _formatColor(color);
    return this;
  }

  /**
   * Set the embed description
   * @param {string} description
   * @returns {DiscordEmbed}
   */
  setDescription(description: string): DiscordEmbed {
    if (!description || typeof description !== 'string')
      throw new SyntaxError('[DISCORD-EMBED] No description provided');
    this.description = description;
    return this;
  }

  /**
   * Add field to the embed
   * @param {string} name
   * @param {string} value
   * @param {boolean} inline
   * @returns {DiscordEmbed}
   */
  addField(name: string, value: string, inline?: boolean): DiscordEmbed {
    if (!name || typeof name !== 'string' || !value || typeof value !== 'string')
      throw new SyntaxError('[DISCORD-EMBED] Invalid field provided');
    this.fields.push({
      name: name,
      value: value,
      inline: inline && typeof inline === 'boolean' ? inline : true,
    });
    return this;
  }

  /**
   * Set the embed footer
   * @param {string} footer
   * @param {string} image URL
   * @returns {DiscordEmbed}
   */
  setFooter(footer: string, image?: string): DiscordEmbed {
    if (!footer || typeof footer !== 'string') throw new SyntaxError('[DISCORD-EMBED] No footer provided');
    this.footer = {};
    this.footer.icon_url = image && typeof image === 'string' && _testURL(image) ? image : undefined;
    this.footer.text = footer;
    return this;
  }

  /**
   * Set the embed video
   * @param {string} video Video URL **(no YouTube link, only .mp4 link)**
   * @returns {DiscordEmbed}
   */
  setVideo(video: string): DiscordEmbed {
    if (!video || typeof video !== 'string' || !_testURL(video))
      throw new SyntaxError('[DISCORD-EMBED] No video url provided');
    this.video = {};
    this.video.url = video;
    return this;
  }

  /**
   * Set the embed provider *(does not seem to work)*
   * @param {string} name
   * @param {string} url
   * @returns {DiscordEmbed}
   * @deprecated
   */
  setProvider(name: string, url?: string): DiscordEmbed {
    if (!name || typeof name !== 'string') throw new SyntaxError('[DISCORD-EMBED] No provider name provided');
    this.provider = {};
    this.provider.name = name;
    this.provider.url = url && typeof url === 'string' && _testURL(url) ? url : undefined;
    return this;
  }

  /**
   * Get the embed at JSON format
   * @returns {object}
   */
  getJSON(): object {
    return {
      title: this.title,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp,
      color: this.color,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      video: this.video,
      provider: this.provider,
      author: this.author,
      fields: this.fields,
    };
  }
}
