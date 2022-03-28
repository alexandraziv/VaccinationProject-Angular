import { Vaccination } from "./vaccination";

export class Person {
    personal_number: string;
    name: string;
    vaccinations: Vaccination[] = [];

    constructor(obj?: any) {
        this.personal_number = obj && obj.personal_number || "";
        this.name = obj && obj.name || "";
        if (obj) {
            for (let itVaccination of obj.vaccinations) {
                this.vaccinations.push(new Vaccination(itVaccination));
            }
        }
    }

}