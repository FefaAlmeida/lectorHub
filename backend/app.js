import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. IMPORTAR TODAS AS ROTAS DA API
import authRotas from './routes/authRotas.js';
import criptografiaRotas from './routes/criptografiaRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import empresaRotas from './routes/empresaRotas.js';
import orcamentoRotas from './routes/orcamentoRotas.js';
import faleConoscoRotas from './routes/faleConoscoRotas.js';
import dashboardRotas from './routes/dashboardRotas.js';
import pagamentoRotas from './routes/pagamentoRotas.js';
import instalacaoRotas from './routes/instalacaoRotas.js';
import tecnicoRotas from './routes/tecnicoRotas.js';
import chamadoRotas from './routes/chamadoRotas.js';
import financeiroRotas from './routes/financeiroRotas.js';
import financeiroClienteRotas from './routes/financeiroClienteRotas.js';

// Importar middlewares
import { errorMiddleware } from './middlewares/errorMiddleware.js';

// Carregar variáveis do arquivo .env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do servidor
const PORT = process.env.PORT || 3002;

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

// Servir arquivos estáticos (Uploads de imagens/comprovantes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ATIVAÇÃO DE TODAS AS ROTAS DA API (Mapeamento Base e Ajustado)
app.use('/api/auth', authRotas);
app.use('/api/criptografia', criptografiaRotas);
app.use('/api/usuarios', usuarioRotas); 
app.use('/api/empresas', empresaRotas);
app.use('/api/orcamentos', orcamentoRotas);
app.use('/api/faleConosco', faleConoscoRotas);
app.use('/api/tecnicos', tecnicoRotas);
app.use('/api/chamados', chamadoRotas); 
app.use('/api/pagamentos', pagamentoRotas); 
app.use('/api/instalacoes', instalacaoRotas); 
app.use('/api/dashboard', dashboardRotas);
app.use('/api/cliente/financeiro', financeiroClienteRotas);
app.use('/api/financeiro', financeiroRotas);


// 3. ROTA RAIZ - MAPA DA DOCUMENTAÇÃO COMPLETA
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API da Luminar - Sistema de Gestão de Energia Solar',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            criptografia: '/api/criptografia',
            usuarios: '/api/usuarios',
            empresas: '/api/empresas',
            orcamentos: '/api/orcamentos',
            faleConosco: '/api/faleConosco',
            instalacoes: '/api/instalacoes',
            tecnicos: '/api/tecnicos',
            chamados: '/api/chamados',
            pagamentos: '/api/pagamentos',
            financeiro_adm: '/api/financeiro',
            financeiro_cliente: '/api/cliente/financeiro',
            dashboard: '/api/dashboard'
        },
        documentacao: {
            // Autenticação e Perfil
            login: 'POST /api/auth/login',
            registrar: 'POST /api/auth/criarUsuario',
            logout: 'POST /api/auth/logout',
            perfil: 'GET /api/auth/perfil',
            atualizarPerfil: 'PUT /api/auth/perfil',
            solicitarRedefinicao: 'POST /api/auth/solicitar-redefinicao-senha',
            redefinirSenha: 'POST /api/auth/redefinir-senha',

            // Criptografia
            infoCriptografia: 'GET /api/criptografia/info',
            cadastrarUsuarioSeguro: 'POST /api/criptografia/cadastrar-usuario',
            
            // Orçamentos
            listarOrcamentos: 'GET /api/orcamentos',                          
            criarOrcamento: 'POST /api/orcamentos',
            validarTokenOrcamento: 'GET /api/orcamentos/cadastro/:token',
            buscarPorEmail: 'GET /api/orcamentos/email/:email',
            buscarPorId: 'GET /api/orcamentos/:id',
            aceitarOrcamento: 'PATCH /api/orcamentos/:id/aceitar',      
            recusarOrcamento: 'PATCH /api/orcamentos/:id/recusar',      
            atualizarOrcamento: 'PUT /api/orcamentos/:id',
            deletarOrcamento: 'DELETE /api/orcamentos/:id',
          

            // Fale Conosco
            criarFaleConosco: 'POST /api/faleConosco',
            listarFaleConosco: 'GET /api/faleConosco', 
            listarPendentes: 'GET /api/faleConosco/pendentes', 
            listarRespondidos: 'GET /api/faleConosco/respondidos', 
            listarPorData: 'GET /api/faleConosco/por-data',        
            buscarPorId: 'GET /api/faleConosco/:id', 
            responderFaleConosco: 'POST /api/faleConosco/:id/responder',

           // Empresas & Endereços
            criarEmpresa: 'POST /api/empresas',
            obterMinhaEmpresa: 'GET /api/empresas/minha',
            obterMeusEnderecos: 'GET /api/empresas/minha/enderecos',
            criarEndereco: 'POST /api/empresas/minha/enderecos',
            atualizarEndereco: 'PUT /api/empresas/minha/enderecos/:id',
            listarEmpresasAdmin: 'GET /api/empresas',
            buscarEmpresaPorId: 'GET /api/empresas/:id', 
            atualizarEmpresa: 'PUT /api/empresas/:id',
            inativarEmpresa: 'PATCH /api/empresas/:id/inativar',
            reativarEmpresa: 'PATCH /api/empresas/:id/reativar',

            // Instalações
            solicitarInstalacao: 'POST /api/instalacoes/solicitar',
            obterMinhasInstalacoes: 'GET /api/instalacoes/minhas',
            listarTodasInstalacoesAdmin: 'GET /api/instalacoes',
            buscarInstalacaoPorId: 'GET /api/instalacoes/:id',
            atualizarInstalacao: 'PUT /api/instalacoes/:id', 
            cancelarSolicitacao: 'PATCH /api/instalacoes/:id/cancelar',

            // Dashboards
            dashboardGeral: 'GET /api/dashboard/geral',
            dashboardResumo: 'GET /api/dashboard/resumo',
            dashboardGrafico: 'GET /api/dashboard/grafico-monitoramento',
            dashboardAlertas: 'GET /api/dashboard/alertas',
            dashboardFinanceiro: 'GET /api/dashboard/financeiro',

            // Técnicos
            listarTecnicos: 'GET /api/tecnicos',
            buscarTecnico: 'GET /api/tecnicos/:id',
            criarTecnico: 'POST /api/tecnicos',
            atualizarTecnico: 'PUT /api/tecnicos/:id',
            inativarTecnico: 'PATCH /api/tecnicos/:id/inativar',

    
            // Chamados
            abrirChamado: 'POST /api/chamados',
            getMeusChamados: 'GET /api/chamados/meus-chamados',
            cancelarChamadoCliente: 'PUT /api/chamados/:id/cancelar',
            getTodosChamadosAdmin: 'GET /api/chamados/admin',
            responderChamadoAdmin: 'PUT /api/chamados/:id/responder',
            getChamadoPorId: 'GET /api/chamados/:id',
            excluirRegistroChamado: 'DELETE /api/chamados/:id',

            // Financeiro ADM, Cliente & Pagamentos Gerais
            getFinanceiroAdmin: 'GET /api/financeiro',
            atualizarStatusPagamentoAdmin: 'PATCH /api/financeiro/:id/status',
            getFinanceiroCliente: 'GET /api/cliente/financeiro',
            inicializarParcelamentoCliente: 'POST /api/cliente/financeiro/setup',
            alterarFormaPagamentoCliente: 'PATCH /api/cliente/financeiro/forma-pagamento',
            pagarParcelaCliente: 'POST /api/cliente/financeiro/:id/pagar', 
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

// Middleware global de tratamento de erros (Deve ser sempre o último)
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`API da Luminar - Sistema de Gestão de Energia Solar`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;