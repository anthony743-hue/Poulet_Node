export class SituationController{
    async getSituation(req,res){
        try {
            const val_date = req.params.date !== null ? new Date(req.params.date) : new Date();
            const idRace = req.params.race;
            
            
        } catch (error) {
            
        }
    }
}