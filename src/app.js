import express from 'express';
import cors from 'cors';
import raceRoute from './routes/raceRoute.js';
import situationRoute from './routes/situationRoute.js'

const app = express();
const port = 3000;

// 1. Middlewares de configuration
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. Définition des routes
app.use('/api/races', raceRoute);
app.use('/api/situations', situationRoute);

// 3. Gestion du 404 (doit être après les routes)
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée'});
});

// 4. Lancement du serveur
app.listen(port, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${port}`);
});

// 5. Exportation (Syntaxe ES Modules)
export default app;