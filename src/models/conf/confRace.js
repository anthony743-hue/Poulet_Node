export class ConfRace {
    #id; #idRace; #prixVente; #prixAtody;

    constructor({ id, idRace, prixVente, prixAtody }) {
        this.id = id; this.idRace = idRace; this.prixVente = prixVente; this.prixAtody = prixAtody;
    }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set idRace(v) { this.#idRace = String(v); }
    get idRace() { return this.#idRace; }

    set prixVente(v) { 
        if (v < 0) throw new Error("Le prix de vente doit être positif.");
        this.#prixVente = Number(v); 
    }
    get prixVente() { return this.#prixVente; }

    set prixAtody(v) { 
        if (v < 0) throw new Error("Le prix des œufs doit être positif.");
        this.#prixAtody = Number(v); 
    }
    get prixAtody() { return this.#prixAtody; }
}