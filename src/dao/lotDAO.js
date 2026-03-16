import { generalDAO } from "../util/generalDAO.js";
const { Lot } = require('../models/Lot');
const { getConnection } = require('../util/dbconnect');
const { LotLib } = require('../models/LotLib');

export class LotDAO extends generalDAO {
    constructor() { super('Lot', Lot); }

    async getLotLib(idRace, daty){
        try {
            const pool = await getConnection();
            let sql = "SELECT * FROM V_LOT_LIB WHERE Date < @daty";
            const rows = null;
            if( idRace === null  ){
                rows = await pool.request().query()
                        .input('daty', daty)
                        .query(sql);
            } else {
                sql+= " AND idrace = @race";
                rows = await pool.request().query()
                        .input('race', idRace)
                        .input('daty', daty)
                        .query(sql);
            }
            return rows.recordset.map( row => new LotLib(row));
        } catch (error) {
            throw error;
        }
    }
}