import express from 'express';
import ChamadoController from '../controllers/ChamadoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas clientes
// POST /chamados -> Cliente abre um novo chamado (Prioridade nasce NULL)
router.post('/', authMiddleware, ChamadoController.abrirChamado);
// GET /chamados/meus-chamados -> Lista os chamados específicos da empresa autenticada
router.get('/meus-chamados', authMiddleware, ChamadoController.listarMeusChamados);
// PUT /chamados/:id/cancelar -> Cliente cancela o próprio chamado (Apenas se o status for 'ABERTO')
router.put('/:id/cancelar', authMiddleware, ChamadoController.cancelarChamadoCliente);


// Rotas ADM
// GET /chamados/admin -> Lista todos os chamados de todas as empresas de forma global
router.get('/admin', authMiddleware, adminMiddleware, ChamadoController.listarTodosChamadosSistema);
// PUT /chamados/:id/responder -> Admin responde, vincula técnico, muda status e DEFINE A PRIORIDADE
router.put('/:id/responder', authMiddleware, adminMiddleware, ChamadoController.responderChamadoAdmin);
// DELETE /chamados/:id -> Remove permanentemente o registro físico do chamado do banco de dados
router.delete('/:id', authMiddleware, adminMiddleware, ChamadoController.excluirRegistroFisico);


// Rota compartilhada
// GET /chamados/:id -> Detalha um chamado específico por ID
router.get('/:id', authMiddleware, ChamadoController.buscarPorId);


router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/meus-chamados', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/admin', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/cancelar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/responder', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;