import { getSituationComplet, getLibComplet } from "../service/situationService.js";
import { getConfByRace, getConfPSByRace } from "../dao/confDAO.js";
import { findBeforeDate } from "../dao/RecensementDAO.js";


export class SituationController{
    async getSituation(req,res){
        try {
            const val_date = req.query.date !== null ? new Date(req.query.date) : new Date();
            const idRace = req.query.idRace;
            const val = await getSituationComplet(idRace, val_date);
            console.log(val);
            const objectToSend = Object.fromEntries(val); 
            res.status(200).json(objectToSend);
        } catch (error) {
            console.log(error);
        }
    }
}