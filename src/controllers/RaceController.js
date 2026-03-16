import { RaceDAO } from "../dao/RaceDAO.js"

export class RaceController{
    getRaces = async(req, res) => {
        try {
            const crd = new RaceDAO();
            res.status(200).json(crd.findAll());
        } catch (error) {
            
        }
    }
}