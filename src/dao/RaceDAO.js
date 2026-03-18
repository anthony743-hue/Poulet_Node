import { generalDAO } from "../util/generalDAO.js";
import { Race } from "../models/Race.js"
import { getConnection } from "../util/dbconnect.js";

export async function findAll() {
    try {
        const pool = await getConnection();
        // console.log("✅ Connexion à SQL Server établie (Pool unique)");
        // Utilisation des "Template Literals" pour plus de clarté
        const query = 'SELECT * FROM Race';
        const rows = await pool.request().query(query);
        rows.recordset.forEach(element => {
            console.log(element);
        });
        //console.log("Données envoyées au client :", result); // Est-ce que c'est [] ou [Race, Race] ?
        return rows.recordset;
    } catch (error) {
        throw new Error(`Erreur dans findAll de Race : ${error.message}`);
    }
}