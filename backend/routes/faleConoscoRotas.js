import express from 'express';
import FaleConoscoController from '../controllers/FaleConoscoController.js';
// Alterado apenas aqui para importar o adminMiddleware que estava faltando
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/', FaleConoscoController.criar);

// Rotas protegidas (somente admin)
router.post('/:id/responder', authMiddleware, adminMiddleware, FaleConoscoController.responder);
router.get('/pendentes', authMiddleware, adminMiddleware, FaleConoscoController.listarPendentes);
router.get('/respondidos', authMiddleware, adminMiddleware, FaleConoscoController.listarRespondidos);
router.get('/por-data', authMiddleware, adminMiddleware, FaleConoscoController.listarPorData);

// Alterado aqui para incluir o adminMiddleware que faltava nessas duas
router.get('/:id', authMiddleware, adminMiddleware, FaleConoscoController.buscarPorId);
router.get('/', authMiddleware, adminMiddleware, FaleConoscoController.listarTodos);

// OPTIONS para CORS (Mantidos exatamente iguais)
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