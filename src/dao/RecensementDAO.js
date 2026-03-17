import { getConnection } from '../util/dbconnect.js';

/**
 * Récupère les recensements antérieurs à une date et les groupe par Lot.
 * @param {Date|string} date - Date de référence.
 * @returns {Promise<Map<number, Array>>} Map groupée par idLot.
 */
export async function findBeforeDate(date) {
    try {
        const pool = await getConnection();
        
        // 1. Ajout de await pour récupérer les données
        const result = await pool.request()
            .input('daty', date)
            .query("SELECT * FROM Recensement WHERE daterecensement < @daty ORDER BY daterecensement ASC");

        const rows = result.recordset;
        const groupedResults = new Map();

        // 2. Groupage efficace des données
        for (const row of rows) {
            const key = row.IdLot; // Utilisation directe de la colonne SQL
            
            if (!groupedResults.has(key)) {
                groupedResults.set(key, []);
            }
            
            // On ajoute la ligne au tableau correspondant au lot
            groupedResults.get(key).push(row);
        }

        return groupedResults;

    } catch (error) {
        console.error("Erreur dans findBeforeDate :", error.message);
        throw error;
    }
}