import { getConnection } from '../util/dbconnect.js';


/**
 * Récupère les données de la table Pondaison avec filtrage optionnel.
 * @param {string|number} idRace - L'identifiant de la race.
 * @param {Date|string} date - La date de référence (pour un usage futur ou filtrage).
 */
export async function PondfindByDate(idRace, date) {
    try {
        const pool = await getConnection();
        const request = pool.request();
        
        // Requête de base
        let query = "SELECT * FROM  V_PONDAISON_LIB WHERE date < @date";
        request.input('date', date);

        // Ajout dynamique de la clause WHERE pour la race
        if (idRace) {
            query += " AND idrace = @race";
            request.input('race', idRace);
        }

        // Note : Si vous devez filtrer par date comme le nom de la fonction le suggère :
        // if (date) {
        //     query += (idRace ? " AND" : " WHERE") + " DatePondaison <= @date";
        //     request.input('date', date);
        // }

        const result = await request.query(query);
        return result.recordset;

    } catch (error) {
        console.error("Erreur dans PondfindByDate :", error.message);
        throw error;
    }
}