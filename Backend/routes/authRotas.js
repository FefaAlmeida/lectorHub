import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import UsuarioController from "../controllers/UsuarioController.js";

const router = express.Router();

// Rotas públicas de autenticação
router.post('/login', AuthController.login);
router.post('/criarUsuario', UsuarioController.criarUsuario);
router.post('/solicitar-redefinicao-senha', AuthController.solicitarRedefinicaoSenha);
router.post('/redefinir-senha', AuthController.redefinirSenha);

// Rotas protegidas (precisam de autenticação)
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/perfil', authMiddleware, AuthController.obterPerfil);
router.put('/perfil', authMiddleware, AuthController.atualizarPerfil);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/criarUsuario', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/solicitar-redefinicao-senha', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/redefinir-senha', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/perfil', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/refresh', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/logout', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;


