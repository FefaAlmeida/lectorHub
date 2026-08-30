import { livroModel } from '../models/LivroModel.js';
import { categoriaModel } from '../models/CategoriaModel.js';
import { avaliacaoModel } from '../models/AvaliacaoModel.js';
import EmprestimoModel from '../models/EmprestimosModel.js';
import { erro, erroInterno } from '../utils/resposta.js';

const ehTexto = (v) => typeof v === 'string';
const texto = (v) => (ehTexto(v) ? v.trim() : '');

// Aceita apenas IDs inteiros positivos — evita levar "abc" até o banco.
function lerId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Valida os campos de livro vindos do body.
// `parcial = true` (PUT) aceita só os campos enviados; `false` (POST) exige os obrigatórios.
// Retorna { dados } ou { erro }.
function validarLivro(body, parcial) {
    const dados = {};
    const anoMaximo = new Date().getFullYear() + 1;

    for (const campo of ['titulo', 'autor']) {
        if (body[campo] === undefined) {
            if (!parcial) return { erro: `O campo '${campo}' é obrigatório.` };
            continue;
        }
        const valor = texto(body[campo]);
        if (!valor) return { erro: `O campo '${campo}' é obrigatório.` };
        dados[campo] = valor;
    }

    // A categoria agora é FK: chega como id, não mais como texto livre.
    if (body.categoria_id === undefined) {
        if (!parcial) return { erro: "O campo 'categoria_id' é obrigatório." };
    } else {
        const categoriaId = Number(body.categoria_id);
        if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
            return { erro: 'Categoria inválida.' };
        }
        dados.categoria_id = categoriaId;
    }

    if (body.ano_publicacao === undefined) {
        if (!parcial) return { erro: "O campo 'ano_publicacao' é obrigatório." };
    } else {
        const ano = Number(body.ano_publicacao);
        if (!Number.isInteger(ano) || ano < 0 || ano > anoMaximo) {
            return { erro: `Ano de publicação inválido (0 a ${anoMaximo}).` };
        }
        dados.ano_publicacao = ano;
    }

    if (body.sinopse !== undefined) {
        if (body.sinopse !== null && !ehTexto(body.sinopse)) return { erro: 'Sinopse inválida.' };
        dados.sinopse = texto(body.sinopse) || null;
    }

    if (body.capa_url !== undefined) {
        if (body.capa_url !== null && !ehTexto(body.capa_url)) return { erro: 'URL da capa inválida.' };
        dados.capa_url = texto(body.capa_url) || null;
    }

    if (body.disponivel !== undefined) {
        if (typeof body.disponivel !== 'boolean') return { erro: "O campo 'disponivel' deve ser true ou false." };
        dados.disponivel = body.disponivel;
    }

    return { dados };
}

export const livroController = {

    async listarLivros(req, res) {
        try {
            const { busca, categoria, categoria_id, disponivel, ordem, pagina, limite } = req.query;

            const idCategoria = Number(categoria_id);

            const resultado = await livroModel.listar({
                busca: texto(busca),
                categoria: texto(categoria),
                categoriaId: Number.isInteger(idCategoria) && idCategoria > 0 ? idCategoria : null,
                disponivel:
                    disponivel === undefined || disponivel === ''
                        ? null
                        : disponivel === 'true' || disponivel === '1',
                ordem: ehTexto(ordem) ? ordem : undefined,
                pagina,
                limite
            });

            return res.status(200).json({
                sucesso: true,
                dados: resultado.livros,
                paginacao: {
                    total: resultado.total,
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            return erroInterno(res, 'listarLivros', error);
        }
    },

    // Vitrine da home: devolve o critério junto, para a tela rotular certo
    // ("Mais emprestados" x "Novidades no acervo") em vez de mentir.
    async listarPopulares(req, res) {
        try {
            const { criterio, livros } = await livroModel.populares(req.query.limite);
            return res.status(200).json({ sucesso: true, criterio, dados: livros });
        } catch (error) {
            return erroInterno(res, 'listarPopulares', error);
        }
    },

    async obterDetalhesLivro(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de livro inválido.');

            const livro = await livroModel.buscarPorId(id);
            if (!livro) return erro(res, 404, 'Livro não encontrado.');

            const [semelhantes, avaliacoes, estatisticas] = await Promise.all([
                livroModel.buscarSemelhantes(livro.categoria_id, id),
                avaliacaoModel.listarPorLivro(id),
                avaliacaoModel.obterEstatisticas(id)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: { ...livro, semelhantes, avaliacoes, estatisticas }
            });
        } catch (error) {
            return erroInterno(res, 'obterDetalhesLivro', error);
        }
    },

    // --- ADMIN ---

    async criar(req, res) {
        try {
            const resultado = validarLivro(req.body || {}, false);
            if (resultado.erro) return erro(res, 400, resultado.erro);

            // Sem isto o INSERT quebraria com erro cru de chave estrangeira.
            if (!await categoriaModel.buscarPorId(resultado.dados.categoria_id)) {
                return erro(res, 400, 'Categoria não encontrada.', 'CATEGORIA_INVALIDA');
            }

            const livro = await livroModel.criar(resultado.dados);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Livro cadastrado com sucesso.',
                dados: livro
            });
        } catch (error) {
            return erroInterno(res, 'criarLivro', error);
        }
    },

    async atualizar(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de livro inválido.');

            const resultado = validarLivro(req.body || {}, true);
            if (resultado.erro) return erro(res, 400, resultado.erro);

            if (Object.keys(resultado.dados).length === 0) {
                return erro(res, 400, 'Nenhum campo para atualizar.');
            }

            if (resultado.dados.categoria_id !== undefined
                && !await categoriaModel.buscarPorId(resultado.dados.categoria_id)) {
                return erro(res, 400, 'Categoria não encontrada.', 'CATEGORIA_INVALIDA');
            }

            // Não dá para "devolver à estante" um livro que está com alguém.
            if (resultado.dados.disponivel === true && await EmprestimoModel.livroEstaEmprestado(id)) {
                return erro(res, 409, 'Este livro está emprestado. Registre a devolução no empréstimo.', 'LIVRO_EMPRESTADO');
            }

            const livro = await livroModel.atualizar(id, resultado.dados);
            if (!livro) return erro(res, 404, 'Livro não encontrado.');

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Livro atualizado com sucesso.',
                dados: livro
            });
        } catch (error) {
            return erroInterno(res, 'atualizarLivro', error);
        }
    },

    async atualizarDisponibilidade(req, res) {
        req.body = { disponivel: req.body?.disponivel };
        return livroController.atualizar(req, res);
    },

    async excluir(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de livro inválido.');

            const livro = await livroModel.buscarPorId(id);
            if (!livro) return erro(res, 404, 'Livro não encontrado.');

            const ativos = await EmprestimoModel.contarAtivosDoLivro(id);
            if (ativos > 0) {
                return erro(res, 409, 'Este livro tem pedidos ou empréstimos em andamento e não pode ser excluído.', 'LIVRO_EM_USO');
            }

            await livroModel.excluir(id);

            return res.status(200).json({ sucesso: true, mensagem: 'Livro excluído.' });
        } catch (error) {
            return erroInterno(res, 'excluirLivro', error);
        }
    }
};
