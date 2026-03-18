import { LotController } from "../controllers/LotController.js"
import express from 'express'

const router = express.Router();

const ctrl = new LotController();
router.get('/', ctrl.getLots);

export default router;