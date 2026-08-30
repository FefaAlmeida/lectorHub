import express from 'express';
import { categoriaController } from '../controllers/CategoriaController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const admin = [authMiddleware, adminMiddleware];

// --- PÚBLICO ---
// GET /api/categorias?com_livros=1 (só as usadas) | ?contagem=1 (todas + total)
router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.obter);

// --- ADMIN ---
router.post('/', ...admin, categoriaController.criar);
router.put('/:id', ...admin, categoriaController.atualizar);
router.delete('/:id', ...admin, categoriaController.excluir);

export default router;
