import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';
import { AUTH_COOKIE } from '../utils/authCookie.js';
import UsuarioModel from '../models/UsuarioModel.js';
import { erro, erroInterno } from '../utils/resposta.js';

// Lê o token do cookie httpOnly (ou do header Bearer) e carrega o usuário.
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.[AUTH_COOKIE];

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (!token) return erro(res, 401, 'É necessário estar logado.', 'NAO_AUTENTICADO');

        const decoded = jwt.verify(token, JWT_CONFIG.secret);
        const usuario = await UsuarioModel.buscarPorId(decoded.id);

        if (!usuario) return erro(res, 401, 'Usuário não encontrado.', 'NAO_AUTENTICADO');

        // O usuário é relido do banco a cada requisição, então banir alguém
        // com sessão aberta tem efeito imediato — sem isso o token continuaria
        // valendo até expirar.
        if (usuario.banido) {
            return erro(res, 403, 'Sua conta foi bloqueada.', 'CONTA_BANIDA');
        }

        req.usuario = { id: usuario.id, tipo: usuario.tipo, email: usuario.email };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return erro(res, 401, 'Sessão expirada. Faça login novamente.', 'NAO_AUTENTICADO');
        }
        if (error.name === 'JsonWebTokenError') {
            return erro(res, 401, 'Token de autenticação inválido.', 'NAO_AUTENTICADO');
        }
        return erroInterno(res, 'authMiddleware', error);
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.usuario) return erro(res, 401, 'É necessário estar logado.', 'NAO_AUTENTICADO');
    if (req.usuario.tipo !== 'admin') {
        return erro(res, 403, 'Apenas administradores podem acessar este recurso.', 'ACESSO_NEGADO');
    }
    next();
};

export { authMiddleware, adminMiddleware };
