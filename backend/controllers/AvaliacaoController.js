import { avaliacaoModel } from '../models/AvaliacaoModel.js';
import { livroModel } from '../models/LivroModel.js';
import { erro, erroInterno } from '../utils/resposta.js';

// Rotas aninhadas em /api/livros/:id/avaliacoes — o :id é o do livro.
function lerIdLivro(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export const avaliacaoController = {

    async listarAvaliacoes(req, res) {
        try {
            const idLivro = lerIdLivro(req);
            if (!idLivro) return erro(res, 400, 'ID de livro inválido.');

            const [avaliacoes, estatisticas] = await Promise.all([
                avaliacaoModel.listarPorLivro(idLivro, req.query.limite),
                avaliacaoModel.obterEstatisticas(idLivro)
            ]);

            return res.status(200).json({ sucesso: true, dados: { avaliacoes, estatisticas } });
        } catch (error) {
            return erroInterno(res, 'listarAvaliacoes', error);
        }
    },

    async salvarAvaliacao(req, res) {
        try {
            const idLivro = lerIdLivro(req);
            if (!idLivro) return erro(res, 400, 'ID de livro inválido.');

            const nota = Number(req.body?.nota);
            if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
                return erro(res, 400, 'A nota deve ser um número inteiro de 1 a 5.');
            }

            const bruto = req.body?.comentario;
            if (bruto !== undefined && bruto !== null && typeof bruto !== 'string') {
                return erro(res, 400, 'Comentário inválido.');
            }
            const comentario = (bruto || '').trim() || null;
            if (comentario && comentario.length > 2000) {
                return erro(res, 400, 'O comentário deve ter no máximo 2000 caracteres.');
            }

            const livro = await livroModel.buscarPorId(idLivro);
            if (!livro) return erro(res, 404, 'Livro não encontrado.');

            const avaliacao = await avaliacaoModel.salvar(idLivro, req.usuario.id, nota, comentario);
            const estatisticas = await avaliacaoModel.obterEstatisticas(idLivro);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Avaliação registrada com sucesso.',
                dados: { avaliacao, estatisticas }
            });
        } catch (error) {
            return erroInterno(res, 'salvarAvaliacao', error);
        }
    },

    async excluirAvaliacao(req, res) {
        try {
            const idLivro = lerIdLivro(req);
            if (!idLivro) return erro(res, 400, 'ID de livro inválido.');

            const excluida = await avaliacaoModel.excluir(idLivro, req.usuario.id);
            if (!excluida) return erro(res, 404, 'Você ainda não avaliou este livro.');

            const estatisticas = await avaliacaoModel.obterEstatisticas(idLivro);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Avaliação removida com sucesso.',
                dados: { estatisticas }
            });
        } catch (error) {
            return erroInterno(res, 'excluirAvaliacao', error);
        }
    }
};
