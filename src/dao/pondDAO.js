import { generalDAO } from "../util/generalDAO.js";

export async function PondfindByDate(idRace, date) {
    const pool = await getConnection();
    const rows = null;
    let query = "select * FROM V_INCUBATION_LIB";
    if (idRace) {
        query += " WHERE idrace = @race";
        rows = pool.request()
            .input('race', idRace)
            .query(query);
    } else {
        rows = pool.request()
            .query(query);
    }
    return rows.recordset;
}