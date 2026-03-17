import { findAll } from "../dao/RaceDAO.js"

export class RaceController{
    getRaces = async(req, res) => {
        try {
            const races = await findAll(); 
            // Envoi des données avec le code 200 (Succès)
            res.status(200).json(races);
        } catch (error) {
            
        }
    }
}