import { livroModel } from "../models/livroModel.js";

export const livroController = {
  async obterDetalhesLivro(req, res) {
    try {
      const { id } = req.params;

      const livro = await livroModel.buscarPorId(id);

      if (!livro) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Livro não encontrado.",
        });
      }

      const estatisticas = await livroModel.obterEstatisticasAvaliacoes(id);
      const semelhantes = await livroModel.buscarSemelhantes(
        livro.categoria_id,
        id
      );

      return res.status(200).json({
        sucesso: true,
        dados: {
          ...livro,
          estatisticas,
          semelhantes,
        },
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar detalhes do livro.",
        erro: error.message,
      });
    }
  },

  async atualizarEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;

      if (quantidade === undefined || quantidade < 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Quantidade inválida.",
        });
      }

      const livroAtualizado = await livroModel.atualizarEstoque(id, quantidade);

      if (!livroAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Livro não encontrado.",
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: "Estoque atualizado com sucesso.",
        dados: livroAtualizado,
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao atualizar estoque do livro.",
        erro: error.message,
      });
    }
  },
};