export class Lot {
    #id; #idRace; #nom; #idMvt; #age; #pu;

    constructor({ id, idRace, nom, idMvt, age, pu = 0 }) {
        this.id = id; this.idRace = idRace; this.nom = nom; 
        this.idMvt = idMvt; this.age = age; this.pu = pu;
    }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set idRace(v) { this.#idRace = String(v); }
    get idRace() { return this.#idRace; }

    set nom(v) { this.#nom = String(v); }
    get nom() { return this.#nom; }

    set idMvt(v) { this.#idMvt = String(v); }
    get idMvt() { return this.#idMvt; }

    set age(v) { this.#age = Number(v); }
    get age() { return this.#age; }

    set pu(v) { 
        if (v < 0) throw new Error("Le prix unitaire doit être positif.");
        this.#pu = Number(v); 
    }
    get pu() { return this.#pu; }
}