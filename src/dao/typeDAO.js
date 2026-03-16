// TypeMouvement.dao.js
import { generalDAO } from "../util/generalDAO.js";
const { TypeEntite } = require('../models/TypeEntite');
const { TypeMouvement } = require('../models/TypeMouvement');

export class TypeMouvementDAO extends generalDAO { 
    constructor() { super('TypeMouvement', TypeMouvement); } 
}

export class TypeEntiteDAO extends generalDAO { 
    constructor() { super('TypeEntite', TypeEntite); } 
}