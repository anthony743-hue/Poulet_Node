import { RaceController } from "../controllers/RaceController.js"
import express from 'express'

const router = express.Router();

const ctrl = new RaceController();
router.get('/', ctrl.getRaces);

export default router;