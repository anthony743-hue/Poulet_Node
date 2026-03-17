export class SituationController{
    async getSituation(req,res){
        try {
            const val_date = req.params.date !== null ? new Date(req.params.date) : new Date();
            const idRace = req.params.race;
            const val = await getSituationComplet()
            res.status(200).json(val);
        } catch (error) {
            
        }
    }
}