// Helper para o cookie de autenticação para manter informações entre as requisições
import { JWT_CONFIG } from '../config/jwt.js';

export const AUTH_COOKIE = 'auth-token';

// Converte "1h", "30m", "7d", "3600" (segundos) etc. em milissegundos.
// Mantém o cookie sempre alinhado com a expiração do JWT (JWT_EXPIRES_IN).
function duracaoParaMs(valor) {
    const padrao = 60 * 60 * 1000; // 1h
    if (valor === undefined || valor === null) return padrao;

    const str = String(valor).trim().toLowerCase();
    const match = str.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/);
    if (!match) return padrao;

    const numero = parseFloat(match[1]);
    const unidade = match[2] || 's';
    const fatores = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return Math.round(numero * fatores[unidade]);
}

// Em produção com frontend e API em domínios diferentes, o navegador só envia
// o cookie em fetch cross-site com SameSite=None + Secure.
// Configure COOKIE_SAME_SITE=none nesse cenário.
function opcoesBase() {
    const sameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
    const secure = process.env.NODE_ENV === 'production' || sameSite === 'none';

    return {
        httpOnly: true,
        sameSite,
        secure,
        path: '/',
    };
}

export function setAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE, token, {
        ...opcoesBase(),
        maxAge: duracaoParaMs(JWT_CONFIG.expiresIn),
    });
}

export function clearAuthCookie(res) {
    res.clearCookie(AUTH_COOKIE, opcoesBase());
}
