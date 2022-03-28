export class Vaccine {
    _id: number;
    name: string;
    manufacturer: string;
    type: number;

    constructor(obj?: any) {
        this._id = obj && obj._id || 0;
        this.name = obj && obj.name || "";
        this.manufacturer = obj && obj.manufacturer || "";
        this.type = obj && obj.type || "";
    }

}