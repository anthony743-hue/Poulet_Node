import { getConnection }  from './dbconnect.js';

export class generalDAO{
    #tableName;
    #modelClass;
    
    constructor(tableName, clazz){
        this.tableName = tableName;
        this.modelClass = clazz;
    }

    set tableName(value){
        if( typeof value !== 'string' ) throw new TypeError("le nom de la table doit etre string");
        
        if( value == null || value.length <= 0 ) throw new Error("le nom de la table doit etre initialisee");
        this.#tableName = value;
    }

    set modelClass(value){
        if( typeof value !== 'class' || value == null ) throw new TypeError("on prends que les classes dans generalDAO");
        this.#modelClass = value;
    }

    async findAll() {
    try {
        const pool = getConnection();
        console.log("✅ Connexion à SQL Server établie (Pool unique)");
        // Utilisation des "Template Literals" pour plus de clarté
        const query = 'SELECT * FROM '+ this.#tableName;
        const rows = await pool.request().query(query);

        const result = rows.recordset.map(row => new this.#modelClass(row));
        console.log("Données envoyées au client :", result); // Est-ce que c'est [] ou [Race, Race] ?
        return result;
    } catch (error) {
        throw new Error(`Erreur dans findAll de ${this.#tableName} : ${error.message}`);
    }
}
}