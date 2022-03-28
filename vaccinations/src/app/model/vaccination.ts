import { Vaccine } from "./vaccine";

export class Vaccination {
    _id: number;
    personal_number: string;
    name: string;
    healthcare_institution: string;
    vaccine: Vaccine;

    constructor(obj?: any) {
        this._id = obj && obj._id || 0;
        this.personal_number = obj && obj.personal_number || "";
        this.name = obj && obj.name || "";
        this.healthcare_institution = obj && obj.healthcare_institution || "";
        this.vaccine = obj && new Vaccine(obj.vaccine) || null;
    }
}