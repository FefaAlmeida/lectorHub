// Carregar variáveis do .env ANTES de qualquer outro import.
// Em ESM os imports são executados antes do corpo do módulo, então um
// dotenv.config() lá embaixo chegaria tarde para quem lê process.env no topo.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. IMPORTAR TODAS AS ROTAS DA API
import authRotas from './routes/authRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';

// Importar middlewares
import { errorMiddleware } from './middlewares/errorMiddleware.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do servidor
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(helmet()); // Segurança HTTP

// Configuração CORS global — origem específica e credentials habilitados
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir arquivos estáticos (uploads de imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ATIVAÇÃO DAS ROTAS DA API
app.use('/api/auth', authRotas);
app.use('/api/usuarios', usuarioRotas);


// 3. ROTA RAIZ - DOCUMENTAÇÃO
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API do Lector Hub',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            usuarios: '/api/usuarios'
        },
        documentacao: {
            // Autenticação
            registrar: 'POST /api/auth/criarUsuario',
            login: 'POST /api/auth/login',
            logout: 'POST /api/auth/logout',
            perfil: 'GET /api/auth/perfil',
            atualizarPerfil: 'PUT /api/auth/perfil',
            solicitarRedefinicao: 'POST /api/auth/solicitar-redefinicao-senha',
            redefinirSenha: 'POST /api/auth/redefinir-senha',

            // Usuários
            meuPerfil: 'GET /api/usuarios/me',
            atualizarMeuPerfil: 'PUT /api/usuarios/me',
            listarUsuarios: 'GET /api/usuarios (admin)',
            atualizarUsuario: 'PUT /api/usuarios/:id (admin)'
        }
    });
});

// Middleware para tratar rotas não encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

// Middleware global de tratamento de erros (deve ser sempre o último)
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`API do Lector Hub`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
