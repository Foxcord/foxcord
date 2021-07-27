import fetch from 'node-fetch';

import { version } from '../../package.json';
import { updateLog } from '../utils/Logger';

/**
 * Test an URL
 * @param {string} url
 * @returns {boolean}
 */
export function _testURL(url: string): boolean {
  const urlRegex = new RegExp(
    '^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return !!urlRegex.test(url);
}

/**
 * Format color
 * @param {string|any} color
 * @returns {number}
 */
export function _formatColor(color: string | any): number {
  if (color.startsWith('#')) return parseInt(color.split('#')[1], 16);
  if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
  return Number(color);
}

/**
 * Check if string is emoji
 * @param {string} emoji
 * @returns {boolean}
 */
export function _isEmoji(emoji: string): boolean {
  if (
    emoji.match(
      [
        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])', // U+1F680 to U+1F6FF
      ].join('|'),
    )
  ) {
    return true;
  }
  return false;
}

/**
 * Log the update
 * @returns {Promise<void>}
 */
export async function _checkForUpdates(): Promise<void> {
  if (/[a-zA-Z]/g.test(version)) {
    return;
  }
  await fetch('https://registry.npmjs.org/foxcord', { method: 'GET' })
    .then((res) => res.json())
    .then((json) => {
      const lastVersion = json['dist-tags'].latest;
      if (lastVersion !== version) {
        return updateLog(version, lastVersion);
      } else {
        return;
      }
    });
}