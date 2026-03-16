export class Pondaison{
    #id;
    #idLot;
    #quantite;
    #datePondaison;
    #pu;
    constructor(data = {}){
        this.id = data.id;
        this.idLot = data.idLot;
        this.quantite = data.quantite;
        this.datePondaison = data.datePondaison;
        this.pu = data.pu;
    }
}