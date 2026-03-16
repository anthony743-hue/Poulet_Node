export class TypeMouvement {
    #id; #nom;
    constructor({ id, nom }) { this.id = id; this.nom = nom; }

    set id(v) { this.#id = String(v); }
    get id() { return this.#id; }

    set nom(v) { 
        this.#nom = v; 
    }
    get nom() { return this.#nom; }
}