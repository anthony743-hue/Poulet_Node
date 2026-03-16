import { generalDAO } from "../util/generalDAO.js";
const { Mouvement } = require('../models/Mouvement');
const { MouvementIncubation } = require('../models/mvtIncu');
const { getConnection } = require('../util/dbconnect');
const { IncubationLib } = require("../models/mvtIncu");

export class MouvementDAO extends generalDAO {
    constructor() { super('Mouvement', Mouvement); }
}

export class MouvementIncubationDAO extends generalDAO {
    constructor() { super('MouvementIncubation', MouvementIncubation); }

    async findByDate(idRace,date){
        const pool = await getConnection();
        const rows = pool.request()
                .input('date', date)
                .input('race', idRace)
                .query("select * FROM V_INCUBATION_LIB WHERE idrace = @race AND date < @date ORDER BY date");
        return rows.recordset.map( row => new IncubationLib(row) );
    }
}