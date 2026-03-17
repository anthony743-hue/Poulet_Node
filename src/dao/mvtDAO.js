import { generalDAO } from "../util/generalDAO.js";
import { Mouvement } from '../models/Mouvement.js';
import { MouvementIncubation } from '../models/mvtIncu.js';
import { getConnection } from '../util/dbconnect.js';
import { IncubationLib } from "../models/mvtIncu.js";

export class MouvementDAO extends generalDAO {
    constructor() { super('Mouvement', Mouvement); }
}

export async function MvtIncufindByDate(idRace,date){
        const pool = await getConnection();

        let query = "select * FROM V_INCUBATION_LIB WHERE date < @date";
        const rows = null;
        if(idRace){
            query+= " AND idrace = @race";
            rows = pool.request()
                .input('date', date)
                .input('race', idRace)
                .query(query);
        } else {
            rows = pool.request()
                .input('date', date)
                .query(query);
        }
        return rows.recordset;
}