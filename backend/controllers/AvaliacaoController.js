import { avaliacaoModel } from "../models/AvaliacaoModel.js";
import { livroModel } from "../models/LivroModel.js";

// Rotas aninhadas em /api/livros/:id/avaliacoes — o :id é o do livro.
function lerIdLivro(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const avaliacaoController = {
  async listarAvaliacoes(req, res) {
    try {
      const idLivro = lerIdLivro(req);

      if (!idLivro) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID de livro inválido.",
        });
      }

      const [avaliacoes, estatisticas] = await Promise.all([
        avaliacaoModel.listarPorLivro(idLivro),
        avaliacaoModel.obterEstatisticas(idLivro),
      ]);

      return res.status(200).json({
        sucesso: true,
        dados: { avaliacoes, estatisticas },
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar avaliações.",
        erro: error.message,
      });
    }
  },

  async salvarAvaliacao(req, res) {
    try {
      const idLivro = lerIdLivro(req);

      if (!idLivro) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID de livro inválido.",
        });
      }

      const nota = Number(req.body?.nota);

      if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "A nota deve ser um número inteiro de 1 a 5.",
        });
      }

      const comentario = req.body?.comentario?.trim() || null;

      if (comentario && comentario.length > 2000) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O comentário deve ter no máximo 2000 caracteres.",
        });
      }

      // Sem isso o INSERT falharia com erro de FK — 404 é mais claro.
      const livro = await livroModel.buscarPorId(idLivro);

      if (!livro) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Livro não encontrado.",
        });
      }

      const avaliacao = await avaliacaoModel.salvar(
        idLivro,
        req.usuario.id,
        nota,
        comentario
      );

      const estatisticas = await avaliacaoModel.obterEstatisticas(idLivro);

      return res.status(200).json({
        sucesso: true,
        mensagem: "Avaliação registrada com sucesso.",
        dados: { avaliacao, estatisticas },
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao salvar avaliação.",
        erro: error.message,
      });
    }
  },

  async excluirAvaliacao(req, res) {
    try {
      const idLivro = lerIdLivro(req);

      if (!idLivro) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID de livro inválido.",
        });
      }

      const excluida = await avaliacaoModel.excluir(idLivro, req.usuario.id);

      if (!excluida) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Você ainda não avaliou este livro.",
        });
      }

      const estatisticas = await avaliacaoModel.obterEstatisticas(idLivro);

      return res.status(200).json({
        sucesso: true,
        mensagem: "Avaliação removida com sucesso.",
        dados: { estatisticas },
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao remover avaliação.",
        erro: error.message,
      });
    }
  },
};
