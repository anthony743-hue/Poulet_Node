import { getConnection } from '../util/dbconnect.js';

/**
 * Récupère les données de pondaison/incubation filtrées par race.
 * @param {string|number} idRace - Identifiant de la race.
 * @param {Date|string} date - Date de référence (non utilisée dans la requête originale, ajoutée ci-dessous si nécessaire).
 */
export async function PondfindByDate(idRace, date) {
    try {
        const pool = await getConnection();
        const request = pool.request();
        
        // Correction de la requête de base
        let query = "SELECT * FROM V_INCUBATION_LIB";

        // Ajout dynamique de la clause WHERE
        if (idRace) {
            query += " WHERE idrace = @race";
            request.input('race', idRace);
        }

        // IMPORTANT : Utilisation de await pour attendre le résultat de la base de données
        const result = await request.query(query);
        
        return result.recordset;
    } catch (error) {
        console.error("Erreur dans PondfindByDate :", error.message);
        throw error;
    }
}