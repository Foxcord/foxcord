/**
 * Class symbolizing a `Sticker`
 * @class
 */
export class Sticker {
    /**
     * Sticker ID
     */
    public id!: string;

    /**
     * Sticker pack ID
     */
    public packID!: string;

    /**
     * Sticker name
     */
    public name!: string;

    /**
     * Stidker description
     */
    public description!: string

    /**
     * Create a new Sticker
     * @param {any} data 
     * @constructor
     */
    constructor(data: any) {
        this._patchData(JSON.parse(data));
    }

    /**
 * @ignore
 * @private
 * @param {any} data
 * @returns {void}
 */
    private _patchData(data: any): void {
        this.id = data.id;
        this.packID = data.pack_id;
        this.name = data.name;
        this.description = data.description;
    }
}