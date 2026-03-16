import { generalDAO } from "../util/generalDAO.js";

export class PondaisonDAO{
    async findByDate(idRace,date){
        const pool = await getConnection();
        const rows = pool.request()
                .input('date', date)
                .input('race', idRace)
                .query("select * FROM V_PONDAISON_LIB WHERE idrace = @race AND date < @date ORDER BY date");
        return rows.recordset.map( row => new IncubationLib(row) );
    }
}