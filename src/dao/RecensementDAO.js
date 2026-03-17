import { generalDAO } from "../util/generalDAO.js";
import { getConnection } from '../util/dbconnect.js';

export async function findBeforeDate(date) {
    const pool = await getConnection();
    const rows = pool.request()
        .input('daty', date)
        .query("SELECT * FROM Recensement WHERE daterecensement < @daty ORDER BY daterecensement");
    const result = rows.recordset.map(row => new this.Recensement(row));
    const arr = {};
    result.forEach(element => {
        const key = result.idLot;
        if (!arr.has(key)) {
            arr.set(key, []);
        }
        const temp = arr.get(key);
        temp.push(element);
    });
    return arr;
}