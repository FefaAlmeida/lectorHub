import express from 'express';
import FinanceiroController from '../controllers/FinanceiroController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas ADM (visão global do financeiro)
// GET /financeiro -> Lista todas as parcelas/pagamentos de todas as empresas com indicadores
router.get('/', authMiddleware, adminMiddleware, FinanceiroController.listarTodos);
// PATCH /financeiro/:id/status -> Admin dá baixa ou reabre uma parcela
router.patch('/:id/status', authMiddleware, adminMiddleware, FinanceiroController.atualizarStatus);

router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/status', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;
