import express from 'express';
import PagamentoController from '../controllers/PagamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.patch('/:id/pagar', authMiddleware, PagamentoController.pagar);

router.options('/:id/pagar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;
