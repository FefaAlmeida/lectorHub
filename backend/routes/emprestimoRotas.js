import express from 'express';
import EmprestimoController from '../controllers/EmprestimosController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


// --- CLIENTE ---

// SOLICITAR EMPRÉSTIMO (aplica as regras de limite e atraso)
router.post('/', authMiddleware, EmprestimoController.solicitarEmprestimo);

// MEUS EMPRÉSTIMOS + situação atual perante as regras
router.get('/meus', authMiddleware, EmprestimoController.meusEmprestimos);

// POSSO PEGAR OUTRO LIVRO? — usado para avisar antes do clique
router.get('/elegibilidade', authMiddleware, EmprestimoController.minhaElegibilidade);

// CANCELAR A PRÓPRIA SOLICITAÇÃO PENDENTE
router.patch('/:id/cancelar', authMiddleware, EmprestimoController.cancelarEmprestimo);

// ÚLTIMO EMPRÉSTIMO DE UM USUÁRIO (o próprio, ou qualquer um se for admin)
router.get('/ultimo/:id_usuario', authMiddleware, EmprestimoController.buscarUltimoEmprestimo);


// --- ADMIN ---

router.get('/', authMiddleware, adminMiddleware, EmprestimoController.listarEmprestimos);

router.get('/total', authMiddleware, adminMiddleware, EmprestimoController.totalEmprestados);

// APROVAR ('EMPRESTADO'), RECUSAR, DEVOLVER...
router.patch('/:id/status', authMiddleware, adminMiddleware, EmprestimoController.atualizarStatus);

export default router;
