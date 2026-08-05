import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';
import { AUTH_COOKIE } from '../utils/authCookie.js';
import UsuarioModel from '../models/UsuarioModel.js';

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.[AUTH_COOKIE];

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                erro: 'Token de acesso não fornecido',
                mensagem: 'É necessário fornecer um token de autenticação'
            });
        }

        const decoded = jwt.verify(token, JWT_CONFIG.secret);

        const usuario = await UsuarioModel.buscarPorId(decoded.id);

        if (!usuario) {
            return res.status(401).json({
                erro: 'Usuário não encontrado',
                mensagem: 'Usuário inválido'
            });
        }

        if (usuario.status_usuario !== 'ATIVO') {
            return res.status(403).json({
                erro: 'Usuário inativo',
                mensagem: 'Sua conta foi desativada'
            });
        }

        req.usuario = {
            id: usuario.id,
            tipo_usuario: usuario.tipo_usuario,
            email: usuario.email
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                erro: 'Token expirado',
                mensagem: 'Faça login novamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                erro: 'Token inválido',
                mensagem: 'Token de autenticação inválido'
            });
        }

        console.error('Erro no middleware de autenticação:', error);

        return res.status(500).json({
            erro: 'Erro interno do servidor'
        });
    }
};

// ADMIN MIDDLEWARE (FORA DO AUTH)
const adminMiddleware = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            erro: 'Não autenticado'
        });
    }

    if (req.usuario.tipo_usuario !== 'ADMIN') {
        return res.status(403).json({
            erro: 'Acesso negado',
            mensagem: 'Apenas administradores podem acessar este recurso'
        });
    }

    next();
};

export { authMiddleware, adminMiddleware };