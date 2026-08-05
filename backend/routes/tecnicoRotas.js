import express from 'express';
import TecnicoController from '../controllers/TecnicoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// CADASTRAR TÉCNICO
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    TecnicoController.criarTecnico
);

// LISTAR TÉCNICOS (PAGINADO)
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    TecnicoController.listarTecnicos
);

// BUSCAR TÉCNICO POR ID
router.get(
    '/:id',
    authMiddleware,
    adminMiddleware,
    TecnicoController.buscarTecnico
);

// ATUALIZAR TÉCNICO
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    TecnicoController.atualizarTecnico
);

// DESATIVAR TÉCNICO (INATIVAR)
router.patch(
    '/:id/inativar',
    authMiddleware,
    adminMiddleware,
    TecnicoController.deletarTecnico
);

// TRATAMENTO DE CORS OPTIONS
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/inativar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;