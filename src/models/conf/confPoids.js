export class ConfPoids {
    #id; #idRace; #age; #variationPoids;

    constructor({ id, idRace, age, variationPoids }) {
        this.id = id; this.idRace = idRace; this.age = age; this.variationPoids = variationPoids;
    }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set idRace(v) { this.#idRace = String(v); }
    get idRace() { return this.#idRace; }

    set age(v) { 
        if (v < 0) throw new Error("L'âge ne peut être négatif.");
        this.#age = Number(v); 
    }
    get age() { return this.#age; }

    set variationPoids(v) { this.#variationPoids = Number(v); }
    get variationPoids() { return this.#variationPoids; }
}