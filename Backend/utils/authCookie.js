// Helper para o cookie de autenticação para manter informações entre as requisições
export const AUTH_COOKIE = 'auth-token';

const ONE_HOUR_MS = 60 * 60 * 1000;

export function setAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ONE_HOUR_MS,
    });
}

export function clearAuthCookie(res) {
    res.clearCookie(AUTH_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
}
