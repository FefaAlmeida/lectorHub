import express from 'express';
import AuthController from '../controllers/AuthController.js';
import UsuarioController from '../controllers/UsuarioController.js';

const router = express.Router();

// Rotas públicas de autenticação
router.post('/login', AuthController.login);
router.post('/criarUsuario', UsuarioController.criarUsuario);
router.post('/solicitar-redefinicao-senha', AuthController.solicitarRedefinicaoSenha);
router.post('/redefinir-senha', AuthController.redefinirSenha);

// Logout é público de propósito: mesmo com token expirado/inválido o cookie
// precisa ser limpo, senão o usuário fica "preso" com uma sessão morta.
router.post('/logout', AuthController.logout);

// Perfil do usuário logado fica em /api/usuarios/me (GET/PUT).
// O preflight CORS (OPTIONS) é tratado pelo cors() global em app.js.

export default router;
