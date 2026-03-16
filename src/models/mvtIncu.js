export class MouvementIncubation{
    #id;
    #idLot;
    #dateIncubation;
    #quantite;
    constructor(data = {}){
        this.id = data.id;
        this.idLot = data.idLot;
        this.dateIncubation = data.dateIncubation;
        this.quantite = data.quantite;
    }   
}

export class IncubationLib{
    #idLot;
    #idRace;
    #quantite;
    constructor(data = {}){
        this.idLot = data.idLot;
        this.idRace = data.idRace;
        this.quantite = data.quantite;
    }
}