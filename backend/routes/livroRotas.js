import express from 'express';
import { livroController } from '../controllers/LivroController.js';
import { avaliacaoController } from '../controllers/AvaliacaoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const admin = [authMiddleware, adminMiddleware];

// --- PÚBLICO ---
// GET /api/livros?busca=&categoria=&disponivel=&ordem=&pagina=&limite=
router.get('/', livroController.listarLivros);
// precisa vir ANTES de '/:id'
router.get('/categorias', livroController.listarCategorias);
router.get('/:id', livroController.obterDetalhesLivro);

// --- ADMIN ---
router.post('/', ...admin, livroController.criar);
router.put('/:id', ...admin, livroController.atualizar);
router.put('/:id/disponibilidade', ...admin, livroController.atualizarDisponibilidade);
router.delete('/:id', ...admin, livroController.excluir);

// --- AVALIAÇÕES ---
router.get('/:id/avaliacoes', avaliacaoController.listarAvaliacoes);
router.post('/:id/avaliacoes', authMiddleware, avaliacaoController.salvarAvaliacao);
router.delete('/:id/avaliacoes', authMiddleware, avaliacaoController.excluirAvaliacao);

export default router;
