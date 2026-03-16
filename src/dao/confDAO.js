import { generalDAO } from "../util/generalDAO.js";
const { ConfRace } = require('../models/conf/confRace');
const { ConfPoids } = require('../models/conf/confPoids');
const { ConfSakafo } = require('../models/conf/confSakafo');
const { ConfLib } = require('../models/conf/confLib')

export class ConfRaceDAO extends generalDAO {
    constructor() { super('ConfRace', ConfRace); }

    async getConfByRace(idRace){
        const pool = await getConnection();
        const rows = await pool.request()
                    .input('race', idRace)
                    .query("SELECT * FROM ConfRace " +
                        "WHERE idRace = @race " + 
                        "ORDER BY [Date] DESC");
        return rows.recordset.map( row => new ConfRace(row));
    }

    async getConfPSByRace(idRace){
        
        const pool = await getConnection();
        const rows = await pool.request()
                    .input('race', idRace)
                    .query("SELECT * FROM v_CONF_LIB WHERE idrace = @race");
        return rows.recordset.map(row => new ConfLib(row));
    }
}

export class ConfPoidsDAO extends generalDAO {
    constructor() { super('ConfPoids', ConfPoids); }

    async findByRaceAndAge(idRace, age) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('race', idRace)
            .input('age', age)
            .query(`SELECT * FROM ConfPoids WHERE idRace = @race AND age <= @age`);
        return result.recordset.length > 0 ? new ConfPoids(result.recordset[0]) : null;
    }
}

export class ConfSakafoDAO extends generalDAO {
    constructor() { super('ConfSakafo', ConfSakafo); }

    async findByRaceAndAge(idRace, age) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('race', idRace)
            .input('age', age)
            .query(`SELECT * FROM ConfSakafo WHERE idRace = @race AND age <= @age`);
        return result.recordset.length > 0 ? new ConfPoids(result.recordset[0]) : null;
    }
}