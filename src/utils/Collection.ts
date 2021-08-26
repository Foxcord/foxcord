/**
 * Class symbolizing a `Collection`
 * @class
 * @extends {Map}
 */
export class Collection<TKey, TObject> extends Map<TKey, TObject> {
  /**
   * Get the first collection value
   * @returns {TObject | undefined}
   */
  public first(): TObject | undefined {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return this.values().next().value;
  }

  /**
   * Get the first collection key
   * @returns {TKey | undefined}
   */
  public firstKey(): TKey | undefined {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return this.keys().next().value;
  }

  /**
   * Get the last collection value
   * @returns {TObject | undefined}
   */
  public last(): TObject | undefined {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Array.from(this.values()).pop();
  }

  /**
   * Get the last collection key
   * @returns {TKey | undefined}
   */
  public lastKey(): TKey | undefined {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Array.from(this.keys()).pop();
  }

  /**
   * Check if key exists
   * @param {TKey} value
   * @returns {boolean}
   */
  public exists(value: TKey): boolean {
    if (!value || typeof value !== 'string') throw new SyntaxError('[COLLECTION] No value provided');
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Object.values(this).includes(value);
  }

  /**
   * Get a random key from the collection
   * @returns {TKey}
   */
  public randomKey(): TKey {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Array.from(this.keys())[Math.floor(Math.random() * Array.from(this.keys()).length)];
  }

  /**
   * Get a random value from the collection
   * @returns {TObject}
   */
  public random(): TObject {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Array.from(this.values())[Math.floor(Math.random() * Array.from(this.values()).length)];
  }

  /**
   * Check if the collection is empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    if (this.size === 0) return true;
    return false;
  }

  /**
   * Get collection entry by value
   * @param {TObject} value
   * @returns {[TKey, TObject] | undefined }
   */
  public find(value: TObject): [TKey, TObject] | undefined {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return Array.from(this.entries()).find(([_k, v]) => v === value);
  }

  /**
   * Returns keys for all instances
   * @param {TObject} obj
   * @returns {(TKey | undefined)[]}
   */
  public findAll(obj: TObject): (TKey | undefined)[] {
    if (this.isEmpty()) throw new Error('T[COLLECTION] The collection is empty');
    return Array.from(this.keys())
      .map((k) => (this.get(k) === obj ? k : undefined))
      .filter((k) => !!k);
  }

  /**
   * Sort the collection
   * @returns {Map<TKey, TObject>}
   */
  public sort(): Map<TKey, TObject> {
    if (this.isEmpty()) throw new Error('[COLLECTION] The collection is empty');
    return new Map([...this.entries()].sort((a: any, b: any) => a[1] - b[1]));
  }
}
