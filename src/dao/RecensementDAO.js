import { generalDAO } from "../util/generalDAO.js";
const { Recensement } = require("./../models/Recensement");
const { getConnection } = require('../util/dbconnect');

export class RecensementDAO extends generalDAO{
    constructor() { super("Recensement", Recensement); }

    async findBeforeDate(date){
        const pool = await getConnection();
        const rows = pool.request()
                    .input('daty', date)
                    .query("SELECT * FROM " + this.tablename + " WHERE daterecensement < @daty ORDER BY daterecensement");
        const result = rows.recordset.map( row => new this.Recensement(row) );
        const arr = {};
        result.forEach(element => {
            const key = result.idLot;
            if( !arr.has(key) ){
                arr.set(key, []);
            }
            const temp = arr.get(key);
            temp.push(element);
        });
        return arr;
    }
}