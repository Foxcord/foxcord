import { _testURL, _formatColor } from '../utils/Utils';

interface AuthorOptions {
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

interface ThumbnailOptions {
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

interface ImageOptions {
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

interface FooterOptions {
  /**
   * Footer text
   */
  text?: string;

  /**
   * Footer icon URL
   */
  icon_url?: string;
}

interface VideoOptions {
  /**
   * Video URL **(no YouTube or Daylimotion link, only `.mp4` link)**
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

interface ProviderOptions {
  /**
   * Provider name
   */
  name?: string;

  /**
   * Provider URL
   */
  url?: string;
}

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
    if (!author || typeof author !== 'string') throw new SyntaxError('NO_AUTHOR_PROVIDED_OR_INVALID_AUTHOR');
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
    if (!title || typeof title !== 'string') throw new SyntaxError('NO_TITLE_PROVIDED_OR_INVALID_TITLE');
    this.title = title;
    return this;
  }

  /**
   * Set the embed URL
   * @param {string} url
   * @returns {DiscordEmbed}
   */
  setURL(url: string): DiscordEmbed {
    if (!url || !_testURL(url)) throw new SyntaxError('NO_URL_PROVIDED_OR_INVALID_URL');
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
    if (!image || !_testURL(image)) throw new SyntaxError('NO_IMAGE_URL_PROVIDED_OR_INVALID_IMAGE_URL');
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
   * @param {string|number} color Hex color
   * @returns {DiscordEmbed}
   */
  setColor(color: string | number): DiscordEmbed {
    if (!color || typeof color !== 'string') throw new SyntaxError('NO_COLOR_PROVIDED_OR_INVALID_COLOR');
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
      throw new SyntaxError('NO_DESCRIPTION_PROVIDED_OR_INVALID_DESCRIPTION');
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
      throw new SyntaxError('INVALID_FIELD_PROVIDED');
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
    if (!footer || typeof footer !== 'string') throw new SyntaxError('NO_FOOTER_PROVIDED_OR_INVALID_FOOTER');
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
      throw new SyntaxError('NO_VIDEO_URL_PROVIDED_OR_INVALID_VIDEO_URL');
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
    if (!name || typeof name !== 'string') throw new SyntaxError('NO_NAME_PROVIDED_OR_INVALID_NAME');
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
