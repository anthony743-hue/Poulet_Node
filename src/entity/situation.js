export class Situation {
    #nomLot;
    #financier;
    #environnement;

    constructor(data = { }) {
        this.nomLot = data.nomLot;
        this.#financier = new SituationFinanciere(data.financier);
        this.#environnement = new SituationEnvironnement(data.environnement);
    }

    get nomLot() { return this.#nomLot; }
    set nomLot(v) { this.#nomLot = String(v); }

    get financier() { return this.#financier; }
    get environnement() { return this.#environnement; }

    toJSON() {
        return {
            nomLot: this.#nomLot,
            financier: this.#financier.data,
            environnement: this.#environnement.data
        };
    }
}

class SituationFinanciere {
    constructor(data = { }) {
        this.achat = data.achat;
        this.sakafo = data.sakafo;
        this.valeurAtody = data.valeurAtody;
        this.benefice = data.benefice;
    }

    get data() {
        return {
            achat: this.achat,
            sakafo: this.sakafo,
            valeurAtody: this.valeurAtody,
            benefice: this.benefice
        };
    }
}

class SituationEnvironnement {
    constructor(data = { }) {
        this.nombrePoules = data.nombrePoules;
        this.nbAtody = data.nbAtody;
        this.poidsMoyen = data.poidsMoyen;
    }

    get data() {
        return {
            nombrePoules: this.nombrePoules,
            nbAtody: this.nbAtody,
            poidsMoyen: this.poidsMoyen
        };
    }
}

export class SituationTemporaire {
    #date_begin; 
    #age_0;
    #sakafo; 
    #mort; 
    #qte;
    constructor(data = {}){
        this.#date_begin = data.date_begin;
        this.#age_0 = data.age_0;
        this.#sakafo = data.sakafo;
        this.#mort = data.mort;
        this.#qte = data.qte;
    }
}