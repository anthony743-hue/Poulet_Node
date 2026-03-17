import { generalDAO } from "../util/generalDAO.js";
import { getConnection } from '../util/dbconnect.js';

export async function MvtIncufindByDate(idRace, date) {
    try {
        const pool = await getConnection();
        
        // Base de la requête
        let sqlQuery = "SELECT * FROM V_INCUBATION_LIB WHERE date < @date";
        
        // Préparation de la requête avec mssql
        const request = pool.request().input('date', date);

        // Ajout conditionnel du filtre par race
        if (idRace) {
            sqlQuery += " AND idrace = @race";
            request.input('race', idRace);
        }

        // Exécution de la requête avec await
        const result = await request.query(sqlQuery);
        
        return result.recordset;
    } catch (error) {
        // Log de l'erreur pour faciliter le debug technique
        console.error("Erreur dans MvtIncufindByDate :", error);
        throw error;
    }
}