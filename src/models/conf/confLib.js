export class ConfLib {
    idRace;
    nomRace;
    age;
    poids;
    quantiteSakafo;

    constructor({ IdRace, NomRace, Age, Poids, QuantiteSakafo } = {}) {
        this.idRace = IdRace;
        this.nomRace = NomRace;
        this.age = Number(Age);
        this.poids = Number(Poids);
        this.quantiteSakafo = Number(QuantiteSakafo);
    }
}