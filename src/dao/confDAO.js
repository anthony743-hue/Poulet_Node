export async function getConfByRace(idRace){
    const pool = await getConnection();
    const rows = await pool.request()
                .input('race', idRace)
                .query("SELECT * FROM ConfRace " +
                    "WHERE idRace = @race " + 
                    "ORDER BY [Date] DESC");
    const map = {};
    rows.recordset.forEach(element => {
        map.set(element.IdRace, element);
    });
}

export async function getConfPSByRace(idRace){  
    const pool = await getConnection();
    const rows = await pool.request()
                .input('race', idRace)
                .query("SELECT * FROM v_CONF_LIB WHERE idrace = @race");
    return rows.recordset;
}

export async function CPfindByRaceAndAge(idRace, age) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('race', idRace)
        .input('age', age)
        .query(`SELECT * FROM ConfPoids WHERE idRace = @race AND age <= @age`);
    return result.recordset;
}

export async function CSfindByRaceAndAge(idRace, age) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('race', idRace)
        .input('age', age)
        .query(`SELECT * FROM ConfSakafo WHERE idRace = @race AND age <= @age`);
    return result.recordset;
}