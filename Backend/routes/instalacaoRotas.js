import express from 'express';
import InstalacaoController from '../controllers/InstalacaoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


// SOLICITAR INSTALAÇÃO (CLIENTE)
router.post('/solicitar', authMiddleware, InstalacaoController.solicitarInstalacao);

// LISTAR MINHAS INSTALAÇÕES (CLIENTE VÊ SEU HISTÓRICO)
router.get('/minhas', authMiddleware, InstalacaoController.minhasInstalacoes);

// LISTAR TODAS AS INSTALAÇÕES (ADMIN)
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    InstalacaoController.listarInstalacoes
);

// BUSCAR INSTALAÇÃO POR ID (CLIENTE OU ADMIN)
router.get('/:id', authMiddleware, InstalacaoController.buscarInstalacao);

// ATUALIZAR INSTALAÇÃO E ENDEREÇO (ADMIN GERE DATA/STATUS OU CLIENTE EDITA)
router.put('/:id', authMiddleware, InstalacaoController.atualizarInstalacao);

// CANCELAR SOLICITAÇÃO DE INSTALAÇÃO
router.patch('/:id/cancelar', authMiddleware, InstalacaoController.cancelarInstalacao);

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

export default router;