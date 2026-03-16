export class LotLib {
    #IdRace;
    #id;
    #age;
    #pu;
    #qte;
    #daty;
    #typemvt;

    constructor({id, age, pu, qte, daty, typemvt, IdRace}) {
        this.IdRace = IdRace;
        this.id = id;
        this.age = age;
        this.pu = pu;
        this.qte = qte;
        this.daty = daty;
        this.typemvt = typemvt;
    }

    // Getters
    get id() { return this.id; }
    get age() { return this.age; }
    get pu() { return this.pu; }
    get qte() { return this.qte; }
    get daty() { return this.daty; }
    get typemvt() { return this.typemvt; }
    get IdRace() { return this.IdRace; }
    // Setters (sans vérification)
    set id(value) { 
        if( value === null || typeof value !== 'string' ) throw new Error("l'id doit etre un string initialisee ");
        this.id = value; 
    }
    set age(value) { 
        if( value === null || typeof value !== 'number' ) throw new Error("l'age doit etre un entier")
        this.age = value; 
    }
    set pu(value) { 
        if( value === null || typeof value !== 'number' || value < 0 ) throw new Error("le pu doit etre un entier positif");
        this.pu = value; 
    }
    set qte(value) { 
        if( value === null || typeof value !== 'number' || value <= 0 ) throw new Error("la qte doit etre initialisee avec une valeur > 0");
        this.qte = value; 
    }
    set daty(value) { 
        if( value === null || typeof value !== 'object' ) throw new Error("la date doit etre non null");
        this.daty = value; 
    }
    set typemvt(value) { this.typemvt = value; }
    set IdRace(value){}
}