type PremiumNames = 'none' | 'Nitro Classic' | 'Nitro';

/**
 * Class symbolozing a `Badges`
 * @class
 */
export class Badges {
  /**
   * Nitro subscription
   */
  public nitro: PremiumNames | undefined;

  private number: number;

  /**
   * Crate a new Badges
   * @param {number} flags
   * @param {number} premium
   * @constructor
   */
  constructor(flags: number, premium?: number) {
    if (premium && typeof premium === 'number') {
      switch (premium) {
        case 1:
          this.nitro = 'Nitro Classic';
          break;
        case 2:
          this.nitro = 'Nitro';
          break;
        default:
          this.nitro = 'none';
          break;
      }
    } else this.nitro = undefined;
    this.number = flags;
  }

  /**
   * Get the user flags number count
   * @returns {number}
   * @example
   * message.author.badges.count();
   */
  public get count(): number {
    return this.number;
  }
}
