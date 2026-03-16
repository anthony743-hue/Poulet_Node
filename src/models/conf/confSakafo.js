export class ConfSakafo {
    #id; #idRace; #age; #quantite;

    constructor({ id, idRace, age, quantite }) {
        this.id = id; this.idRace = idRace; this.age = age; this.quantite = quantite;
    }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set idRace(v) { this.#idRace = String(v); }
    get idRace() { return this.#idRace; }

    set age(v) { this.#age = Number(v); }
    get age() { return this.#age; }

    set quantite(v) { 
        if (v < 0) throw new Error("La quantité de nourriture doit être positive.");
        this.#quantite = Number(v); 
    }
    get quantite() { return this.#quantite; }
}