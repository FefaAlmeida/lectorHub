// Carregar variáveis do .env ANTES de qualquer outro import.
// Em ESM os imports são executados antes do corpo do módulo, então um
// dotenv.config() lá embaixo chegaria tarde para quem lê process.env no topo.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// 1. IMPORTAR TODAS AS ROTAS DA API
import authRotas from './routes/authRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import livroRotas from './routes/livroRotas.js';
import emprestimoRotas from './routes/emprestimoRotas.js';

// Importar middlewares
import { errorMiddleware } from './middlewares/errorMiddleware.js';


const app = express();

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

// 2. ATIVAÇÃO DAS ROTAS DA API
app.use('/api/auth', authRotas);
app.use('/api/usuarios', usuarioRotas);
app.use('/api/livros', livroRotas);
app.use('/api/emprestimos', emprestimoRotas);


// 3. ROTA RAIZ - DOCUMENTAÇÃO
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API do Lector Hub',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            usuarios: '/api/usuarios',
            livros: '/api/livros',
            emprestimos: '/api/emprestimos'
        },
        documentacao: {
            // Autenticação
            registrar: 'POST /api/auth/criarUsuario',
            login: 'POST /api/auth/login',
            logout: 'POST /api/auth/logout',
            solicitarRedefinicao: 'POST /api/auth/solicitar-redefinicao-senha',
            redefinirSenha: 'POST /api/auth/redefinir-senha',

            // Usuários
            meuPerfil: 'GET /api/usuarios/me',
            atualizarMeuPerfil: 'PUT /api/usuarios/me (senha_atual obrigatória p/ trocar e-mail ou senha)',
            listarUsuarios: 'GET /api/usuarios?pagina=&limite= (admin)',
            atualizarUsuario: 'PUT /api/usuarios/:id (admin)',

            // Livros
            listarLivros: 'GET /api/livros?busca=&categoria=&disponivel=&ordem=&pagina=&limite=',
            categoriasLivros: 'GET /api/livros/categorias',
            detalhesLivro: 'GET /api/livros/:id',
            criarLivro: 'POST /api/livros (admin)',
            atualizarLivro: 'PUT /api/livros/:id (admin)',
            atualizarDisponibilidade: 'PUT /api/livros/:id/disponibilidade (admin)',
            excluirLivro: 'DELETE /api/livros/:id (admin; 409 se houver empréstimo ativo)',

            // Avaliações
            listarAvaliacoes: 'GET /api/livros/:id/avaliacoes?limite=',
            avaliarLivro: 'POST /api/livros/:id/avaliacoes (autenticado)',
            removerAvaliacao: 'DELETE /api/livros/:id/avaliacoes (autenticado)',

            // Empréstimos — máx. 2 ativos por usuário e nenhum se houver atraso
            solicitarEmprestimo: 'POST /api/emprestimos (autenticado)',
            meusEmprestimos: 'GET /api/emprestimos/meus (autenticado)',
            elegibilidade: 'GET /api/emprestimos/elegibilidade (autenticado)',
            cancelarEmprestimo: 'PATCH /api/emprestimos/:id/cancelar (autenticado, só PENDENTE)',
            listarEmprestimos: 'GET /api/emprestimos?status=&pagina=&limite= (admin)',
            resumoAdmin: 'GET /api/emprestimos/resumo (admin)',
            atualizarStatusEmprestimo: 'PATCH /api/emprestimos/:id/status { status, prazo_dias? } (admin; PENDENTE->EMPRESTADO|RECUSADO, EMPRESTADO->DEVOLVIDO)',
            estenderPrazo: 'PATCH /api/emprestimos/:id/prazo { dias } (admin, só EMPRESTADO)'
        }
    });
});

// Middleware para tratar rotas não encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
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
