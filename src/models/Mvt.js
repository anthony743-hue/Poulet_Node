export class Mouvement {
    #id; #date; #quantite; #idTypeEntite; #idTypeMvt; #idMvtAchat; #remarque;

    constructor({ id, date, quantite, idTypeEntite, idTypeMvt, idMvtAchat = null, remarque = '' }) {
        this.id = id; this.date = date; this.quantite = quantite;
        this.idTypeEntite = idTypeEntite; this.idTypeMvt = idTypeMvt;
        this.idMvtAchat = idMvtAchat; this.remarque = remarque;
    }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set date(v) { 
        const d = new Date(v);
        if (isNaN(d.getTime())) throw new Error("Date invalide.");
        this.#date = d; 
    }
    get date() { return this.#date; }

    set quantite(v) { 
        if (v <= 0) throw new Error("La quantité de mouvement ne peut être négative.");
        this.#quantite = Number(v); 
    }
    get quantite() { return this.#quantite; }

    set idTypeEntite(v) { this.#idTypeEntite = String(v); }
    get idTypeEntite() { return this.#idTypeEntite; }

    set idTypeMvt(v) { this.#idTypeMvt = String(v); }
    get idTypeMvt() { return this.#idTypeMvt; }

    set idMvtAchat(v) { this.#idMvtAchat = v ? String(v) : null; }
    get idMvtAchat() { return this.#idMvtAchat; }

    set remarque(v) { this.#remarque = String(v || ''); }
    get remarque() { return this.#remarque; }
}