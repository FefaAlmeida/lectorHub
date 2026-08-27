import express from 'express';
import EmprestimoController from '../controllers/EmprestimosController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- CLIENTE ---
router.post('/', authMiddleware, EmprestimoController.solicitarEmprestimo);
router.get('/meus', authMiddleware, EmprestimoController.meusEmprestimos);
router.get('/elegibilidade', authMiddleware, EmprestimoController.minhaElegibilidade);
router.patch('/:id/cancelar', authMiddleware, EmprestimoController.cancelarEmprestimo);

// --- ADMIN --- (rotas fixas antes de '/:id')
router.get('/resumo', authMiddleware, adminMiddleware, EmprestimoController.resumo);
router.get('/', authMiddleware, adminMiddleware, EmprestimoController.listarEmprestimos);
router.patch('/:id/status', authMiddleware, adminMiddleware, EmprestimoController.atualizarStatus);
router.patch('/:id/prazo', authMiddleware, adminMiddleware, EmprestimoController.estenderPrazo);

export default router;
