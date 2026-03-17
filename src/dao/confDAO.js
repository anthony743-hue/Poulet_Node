import { getConnection } from "../util/dbconnect.js";

/**
 * Récupère et fusionne les configurations de poulets et de produits par race.
 */
export async function getConfByRace(idRace) {
    const pool = await getConnection();

    const [resPoulet, resProduit] = await Promise.all([
        pool.request()
            .input('race', idRace)
            .query("SELECT * FROM ConfPoulet WHERE (idRace = @race OR @race IS NULL)"),
        pool.request()
            .input('race', idRace)
            .query("SELECT * FROM ConfProduit WHERE (idRace = @race OR @race IS NULL)")
    ]);

    const confMap = new Map();

    resPoulet.recordset.forEach(row => {
        // Utilisation de row.idRace (attention à la casse selon votre DB)
        confMap.set(row.IdRace, {
            ...row,
            produits: []
        });
    });

    resProduit.recordset.forEach(prod => {
        if (confMap.has(prod.IdRace)) {
            confMap.get(prod.IdRace).produits.push(prod);
        }
    });

    return confMap;
}

export async function getConfPSByRace(idRace) {  
    try {
        const pool = await getConnection();
        const rows = await pool.request()
                .input('race', idRace)
                .query("SELECT * FROM V_CONF_LIB WHERE (idrace = @race OR @race IS NULL) ORDER BY AgeSemaine");
        
        return rows.recordset;
    } catch (error) {
        console.error("Code erreur SQL:", error.code);
        console.error("Message SQL:", error.message);
        throw error; // Important de propager l'erreur
    }
}
export async function CPfindByRaceAndAge(idRace, age) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('race', idRace)
        .input('age', age)
        .query("SELECT * FROM ConfPoids WHERE (idRace = @race OR @race IS NULL) AND AgeSemaine <= @age ORDER BY AgeSemaine");
    return result.recordset;
}

export async function CSfindByRaceAndAge(idRace, age) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('race', idRace)
        .input('age', age)
        .query("SELECT * FROM ConfSakafo WHERE (idRace = @race OR @race IS NULL) AND age <= @age ORDER BY age");
    return result.recordset;
}