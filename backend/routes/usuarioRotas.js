import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


// VER PRÓPRIO PERFIL
router.get('/me', authMiddleware, UsuarioController.me);

// ATUALIZAR PRÓPRIO PERFIL
router.put('/me', authMiddleware, UsuarioController.atualizarMeuPerfil);

// LISTAR USUÁRIOS
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    UsuarioController.listarUsuarios
);

// ATUALIZAR QUALQUER USUÁRIO
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UsuarioController.atualizarUsuario
);

// INATIVAR USUÁRIO
router.patch(
    '/:id/inativar',
    authMiddleware,
    adminMiddleware,
    UsuarioController.inativarUsuario
);

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