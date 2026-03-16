import { generalDAO } from "../util/generalDAO.js";
import { Race } from "../models/Race.js"

export class RaceDAO extends generalDAO {
    constructor() {
        super('Race', Race);
    }
}