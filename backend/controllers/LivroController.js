import { livroModel } from "../models/LivroModel.js";
import { avaliacaoModel } from "../models/AvaliacaoModel.js";

// Aceita apenas IDs inteiros positivos — evita levar "abc" até o banco.
function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const livroController = {
  async listarLivros(req, res) {
    try {
      const { busca, categoria, disponivel, ordem, pagina, limite } = req.query;

      const resultado = await livroModel.listar({
        busca: busca?.trim() || "",
        categoria: categoria?.trim() || "",
        disponivel:
          disponivel === undefined || disponivel === ""
            ? null
            : disponivel === "true" || disponivel === "1",
        ordem,
        pagina,
        limite,
      });

      return res.status(200).json({
        sucesso: true,
        dados: resultado.livros,
        paginacao: {
          total: resultado.total,
          pagina: resultado.pagina,
          limite: resultado.limite,
          totalPaginas: resultado.totalPaginas,
        },
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar livros.",
        erro: error.message,
      });
    }
  },

  async listarCategorias(req, res) {
    try {
      const categorias = await livroModel.listarCategorias();

      return res.status(200).json({ sucesso: true, dados: categorias });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar categorias.",
        erro: error.message,
      });
    }
  },

  async obterDetalhesLivro(req, res) {
    try {
      const id = lerId(req);

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID de livro inválido.",
        });
      }

      const livro = await livroModel.buscarPorId(id);

      if (!livro) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Livro não encontrado.",
        });
      }

      const [semelhantes, avaliacoes, estatisticas] = await Promise.all([
        livroModel.buscarSemelhantes(livro.categoria, id),
        avaliacaoModel.listarPorLivro(id),
        avaliacaoModel.obterEstatisticas(id),
      ]);

      return res.status(200).json({
        sucesso: true,
        dados: {
          ...livro,
          semelhantes,
          avaliacoes,
          estatisticas,
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

  async atualizarDisponibilidade(req, res) {
    try {
      const id = lerId(req);

      if (!id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID de livro inválido.",
        });
      }

      const { disponivel } = req.body;

      if (typeof disponivel !== "boolean") {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O campo 'disponivel' deve ser true ou false.",
        });
      }

      const livroAtualizado = await livroModel.atualizarDisponibilidade(
        id,
        disponivel
      );

      if (!livroAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Livro não encontrado.",
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: "Disponibilidade atualizada com sucesso.",
        dados: livroAtualizado,
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao atualizar disponibilidade do livro.",
        erro: error.message,
      });
    }
  },
};
