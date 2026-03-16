export class Race {
    #id;
    #nom;
    #description;

    constructor({ ID, Nom, Description }) {
        this.id = ID;
        this.nom = Nom;
        this.description = Description;
    }

    set id(value){
        // if( typeof value !== 'string' ) throw new TypeError("L'id doit etre un string");
        this.#id = value;
    }

    set nom(value){
        // if( typeof value !== 'string' ) throw new TypeError("Le nom doit etre un string");
        
        if( value.trim().length === 0 ) throw new TypeError("Le nom doit etre obligatoire");
        this.#nom = value;
    }

    set description(value){
        if( typeof value !== 'string' ) throw new TypeError("La description doit etre un string");
        this.#description = value;
    }

    get id() { return this.#id; }
    get nom() { return this.#nom; }
    get description() { return this.#description; }

    toString(){
        return 'Race: ' + this.nom + ' ID : ' + this.ID;
    }
}