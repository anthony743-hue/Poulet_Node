import { getConnection } from '../util/dbconnect.js';

/**
 * Récupère la liste des lots avec libellés, optionnellement filtrée par race.
 * @param {string|number|null} idRace - L'identifiant de la race ou null pour tous les lots.
 */
export async function getLotLib(idRace) {
    try {
        const pool = await getConnection();
        
        // Initialisation de la requête de base
        let sql = "SELECT * FROM V_LOT_LIB";
        const request = pool.request();

        // Gestion dynamique de la clause WHERE
        if (idRace !== null && idRace !== undefined) {
            sql += " WHERE idrace = @race";
            request.input('race', idRace);
        }

        const result = await request.query(sql);
        return result.recordset;

    } catch (error) {
        // Log technique pour faciliter la maintenance
        console.error("Erreur dans getLotLib :", error.message);
        throw error;
    }
}