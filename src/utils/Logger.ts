import { consoleBackgrounds, consoleColors, consoleStyles } from './Constants';

/**
 * Basic Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function basicLog(content: string): void {
  return console.log(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleColors.Cyan}[Log]${consoleStyles.Reset}: ${content}`,
  );
}

/**
 * Warn Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function warnLog(content: string): void {
  return console.log(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleColors.Yellow}[Warn]${consoleStyles.Reset}: ${content}`,
  );
}

/**
 * Error Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function errLog(content: string): void {
  throw new Error(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleColors.Red}[Error]${consoleStyles.Reset}: ${content}`,
  );
}

/**
 * Debug Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function debugLog(content: string): void {
  return console.log(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleColors.Green}[Debug]${consoleStyles.Reset}: ${content}`,
  );
}

/**
 * Info Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function infoLog(content: string): void {
  return console.log(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleColors.Magenta}[Info]${consoleStyles.Reset}: ${content}`,
  );
}

/**
 * Update Foxcord log in the console
 * @param {string} content
 * @returns {void}
 */
export function updateLog(oldVersion: number | any, newVersion: number): void {
  return console.log(
    `${consoleColors.Blue}FoxCord${consoleStyles.Reset} ${consoleStyles.Bright}AN UPDATE IS AVAILABLE${consoleStyles.Reset}: ${consoleStyles.Reverse}v${oldVersion} to v${newVersion}${consoleStyles.Reset}\n${consoleStyles.Bright}npm i foxcord@latest${consoleStyles.Reset}`,
  );
}
