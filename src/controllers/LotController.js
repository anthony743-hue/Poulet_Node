import { findAll } from '../dao/lotDAO.js'

export class LotController{
    async getLots(req, res) {
        try {
            const ls = await findAll();
            res.status(200).json(ls);
        } catch (error) {
            console.error(error);
        }
    }
}