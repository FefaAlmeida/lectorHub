import express from 'express';
import DashboardController from '../controllers/DashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/geral', authMiddleware, DashboardController.obterDadosGerais);
router.get('/resumo', authMiddleware, DashboardController.resumo);
router.get('/grafico-monitoramento', authMiddleware, DashboardController.graficoMonitoramento);
router.get('/alertas', authMiddleware, DashboardController.alertas);
router.get('/financeiro', authMiddleware, DashboardController.financeiro);

router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;
