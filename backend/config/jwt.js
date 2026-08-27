import dotenv from 'dotenv';

// Carregar variáveis do arquivo .env
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env — a API não pode assinar sessões sem ele.');
}

// Configurações JWT
export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
