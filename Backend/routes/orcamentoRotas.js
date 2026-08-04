import express from 'express';
import OrcamentoController from '../controllers/OrcamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', OrcamentoController.listarTodos);
router.get('/email/:email', OrcamentoController.buscarPorEmail);
router.get('/cadastro/:token', OrcamentoController.validarToken)
router.get('/:id', OrcamentoController.buscarPorId);

router.post('/', OrcamentoController.criar);

router.patch('/:id/aceitar', OrcamentoController.aceitar);
router.patch('/:id/recusar', OrcamentoController.recusar);

// Rotas protegidas (somente admin)
router.put('/:id', authMiddleware, OrcamentoController.atualizar);
router.delete('/:id', authMiddleware, OrcamentoController.excluir);

// OPTIONS para CORS
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id/aceitar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id/recusar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;