export class Recensement {
    #id;
    #idLot;
    #idTypeEntite;
    #dateRecensement;
    #quantite;

    constructor(data = {}) {
        this.id = data.id;
        this.idLot = data.idLot;
        this.idTypeEntite = data.idTypeEntite;
        this.dateRecensement = data.dateRecensement || new Date();
        this.quantiteTheorique = data.quantiteTheorique || 0;
        this.quantiteReelle = data.quantiteReelle || 0;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get idLot() { return this.#idLot; }
    get idTypeEntite() { return this.#idTypeEntite; }
    get dateRecensement() { return this.#dateRecensement; }
    get quantite() { return this.#quantite; }

    // --- SETTERS ---
    set id(value) {
        this.#id = value;
    }

    set idLot(value) {
        if (!value) throw new Error("IdLot est obligatoire.");
        this.#idLot = value;
    }

    set idTypeEntite(value) {
        this.#idTypeEntite = value;
    }

    set dateRecensement(value) {
        this.#dateRecensement = value instanceof Date ? value : new Date(value);
    }

    set quantite(value) {
        this.#quantite = parseInt(value) || 0;
    }

    /**
     * Sérialisation pour envoi JSON ou API
     */
    toJSON() {
        return {
            id: this.#id,
            idLot: this.#idLot,
            idTypeEntite: this.#idTypeEntite,
            dateRecensement: this.#dateRecensement.toISOString().split('T')[0],
            quantite: this.#quantite
        };
    }
}