import express from 'express';
import { livroController } from '../controllers/LivroController.js';
import { avaliacaoController } from '../controllers/AvaliacaoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


// LISTAR LIVROS (público — catálogo é aberto)
// GET /api/livros?busca=&categoria=&disponivel=&ordem=&pagina=&limite=
router.get('/', livroController.listarLivros);

// CATEGORIAS DISPONÍVEIS — precisa vir ANTES de '/:id',
// senão o Express casaria "categorias" como se fosse um id.
router.get('/categorias', livroController.listarCategorias);

// DETALHES DE UM LIVRO (público)
router.get('/:id', livroController.obterDetalhesLivro);

// MARCAR DISPONÍVEL / INDISPONÍVEL
router.put(
    '/:id/disponibilidade',
    authMiddleware,
    adminMiddleware,
    livroController.atualizarDisponibilidade
);


// --- AVALIAÇÕES DO LIVRO ---

// LISTAR AVALIAÇÕES (público)
router.get('/:id/avaliacoes', avaliacaoController.listarAvaliacoes);

// CRIAR OU ATUALIZAR A PRÓPRIA AVALIAÇÃO
router.post('/:id/avaliacoes', authMiddleware, avaliacaoController.salvarAvaliacao);

// REMOVER A PRÓPRIA AVALIAÇÃO
router.delete('/:id/avaliacoes', authMiddleware, avaliacaoController.excluirAvaliacao);

export default router;
