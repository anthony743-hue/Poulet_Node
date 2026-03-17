import { getConnection } from "../util/dbconnect.js";

/**
 * Récupère et fusionne les configurations de poulets et de produits par race.
 */
export async function getConfByRace(idRace) {
    const pool = await getConnection();

    // Récupération simultanée pour optimiser les performances
    const [resPoulet, resProduit] = await Promise.all([
        pool.request()
            .input('race', idRace)
            .query("SELECT * FROM ConfPoulet WHERE idRace = @race ORDER BY DateFin DESC"),
        pool.request()
            .input('race', idRace)
            .query("SELECT * FROM ConfProduit WHERE idRace = @race ORDER BY DateFin DESC")
    ]);

    const confPoulets = resPoulet.recordset;
    const confProduits = resProduit.recordset;

    // Structuration des données (Exemple : Regrouper les produits par ID de configuration)
    return {
        configurations: confPoulets,
        produitsAssocies: confProduits
    };
}

export async function getConfPSByRace(idRace) {  
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
        .query("SELECT * FROM ConfPoids WHERE idRace = @race AND age <= @age ORDER BY age DESC");
    return result.recordset;
}

export async function CSfindByRaceAndAge(idRace, age) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('race', idRace)
        .input('age', age)
        .query("SELECT * FROM ConfSakafo WHERE idRace = @race AND age <= @age ORDER BY age DESC");
    return result.recordset;
}