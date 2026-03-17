import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'Sqlserver123!',
    server: '127.0.0.1',
    database: 'Gestion_poulet',
    port: 1433,
    pool: {
        max: 20,
        min: 5,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let poolPromise = null;

export async function getConnection() {
    try {
        // Si le pool existe déjà et qu'il est connecté, on le renvoie
        if (poolPromise !== null) {
            const pool = await poolPromise;
            if (pool.connected) return pool;
            poolPromise = null; // Si déconnecté, on réinitialise
        }

        poolPromise = new sql.ConnectionPool(config).connect();
        console.log("Connexion a SQL Server etablie");
        return await poolPromise;
    } catch (error) {
        console.error("❌ Erreur de connexion SQL Server :", error);
        poolPromise = null; // Très important : permet de réessayer au prochain appel
        throw error;
    }
    // SURTOUT PAS de pool.close() ici !
}

export { sql };