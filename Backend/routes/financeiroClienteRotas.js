import express from 'express';
import FinanceiroClienteController from '../controllers/FinanceiroClienteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /cliente/financeiro
router.get('/', authMiddleware, FinanceiroClienteController.obterPainel);

// POST /cliente/financeiro/setup
router.post('/setup', authMiddleware, FinanceiroClienteController.inicializarParcelamento);

// PATCH /cliente/financeiro/forma-pagamento
router.patch('/forma-pagamento', authMiddleware, FinanceiroClienteController.alterarMetodoPagamento);

// POST /cliente/financeiro/:id/pagar
router.post('/:id/pagar', authMiddleware, FinanceiroClienteController.pagarParcela);



router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/setup', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/forma-pagamento', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/pagar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;