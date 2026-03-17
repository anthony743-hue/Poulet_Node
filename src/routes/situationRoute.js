import { SituationController } from "../controllers/situationController.js"
import express from 'express'

const router = express.Router();

const ctrl = new SituationController();
router.get('/', ctrl.getSituation);

export default router;