import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
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

// BANIR / REATIVAR
router.put(
    '/:id/banimento',
    authMiddleware,
    adminMiddleware,
    UsuarioController.definirBanimento
);

// ATUALIZAR QUALQUER USUÁRIO
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UsuarioController.atualizarUsuario
);

export default router;