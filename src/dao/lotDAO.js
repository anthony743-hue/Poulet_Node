import { getConnection } from '../util/dbconnect.js';

async function getLotLib(idRace, daty){
    try {
        const pool = await getConnection();
        let sql = "SELECT * FROM V_LOT_LIB WHERE Date < @daty";
        const rows = null;
        if (idRace === null) {
            rows = await pool.request().query()
                .input('daty', daty)
                .query(sql);
        } else {
            sql += " AND idrace = @race";
            rows = await pool.request().query()
                .input('race', idRace)
                .input('daty', daty)
                .query(sql);
        }
        return rows.recordset;
    } catch (error) {
        throw error;
    }
}