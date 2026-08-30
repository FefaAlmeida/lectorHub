import { categoriaModel } from '../models/CategoriaModel.js';
import { erro, erroInterno } from '../utils/resposta.js';

const NOME_MAX = 50;
const DESCRICAO_MAX = 255;

function lerId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Retorna { dados } ou { erro }. `parcial` (PUT) aceita só o que veio.
function validar(body, parcial) {
    const dados = {};

    if (body.nome === undefined) {
        if (!parcial) return { erro: "O campo 'nome' é obrigatório." };
    } else {
        if (typeof body.nome !== 'string') return { erro: 'Nome inválido.' };
        const nome = body.nome.trim();
        if (!nome) return { erro: "O campo 'nome' é obrigatório." };
        if (nome.length > NOME_MAX) return { erro: `O nome deve ter no máximo ${NOME_MAX} caracteres.` };
        dados.nome = nome;
    }

    if (body.descricao !== undefined) {
        if (body.descricao !== null && typeof body.descricao !== 'string') {
            return { erro: 'Descrição inválida.' };
        }
        const descricao = (body.descricao || '').trim();
        if (descricao.length > DESCRICAO_MAX) {
            return { erro: `A descrição deve ter no máximo ${DESCRICAO_MAX} caracteres.` };
        }
        dados.descricao = descricao || null;
    }

    return { dados };
}

export const categoriaController = {

    // GET /api/categorias?com_livros=1  -> só categorias que têm livro
    //                    ?contagem=1    -> todas, com total_livros
    async listar(req, res) {
        try {
            const somenteComLivros = req.query.com_livros === '1' || req.query.com_livros === 'true';
            const comContagem = req.query.contagem === '1' || req.query.contagem === 'true';

            const categorias = somenteComLivros
                ? await categoriaModel.listarComLivros()
                : await categoriaModel.listar({ comLivros: comContagem });

            return res.status(200).json({ sucesso: true, dados: categorias });
        } catch (error) {
            return erroInterno(res, 'listarCategorias', error);
        }
    },

    async obter(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de categoria inválido.');

            const categoria = await categoriaModel.buscarPorId(id);
            if (!categoria) return erro(res, 404, 'Categoria não encontrada.');

            return res.status(200).json({
                sucesso: true,
                dados: { ...categoria, total_livros: await categoriaModel.contarLivros(id) }
            });
        } catch (error) {
            return erroInterno(res, 'obterCategoria', error);
        }
    },

    // --- ADMIN ---

    async criar(req, res) {
        try {
            const { dados, erro: invalido } = validar(req.body || {}, false);
            if (invalido) return erro(res, 400, invalido);

            // A UNIQUE KEY já barraria, mas a mensagem do MySQL não serve ao usuário.
            if (await categoriaModel.buscarPorNome(dados.nome)) {
                return erro(res, 409, `Já existe uma categoria chamada "${dados.nome}".`, 'CATEGORIA_DUPLICADA');
            }

            const categoria = await categoriaModel.criar(dados);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Categoria criada com sucesso.',
                dados: categoria
            });
        } catch (error) {
            return erroInterno(res, 'criarCategoria', error);
        }
    },

    async atualizar(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de categoria inválido.');

            const { dados, erro: invalido } = validar(req.body || {}, true);
            if (invalido) return erro(res, 400, invalido);

            if (Object.keys(dados).length === 0) {
                return erro(res, 400, 'Nenhum campo para atualizar.');
            }

            if (dados.nome) {
                const existente = await categoriaModel.buscarPorNome(dados.nome);
                if (existente && existente.id !== id) {
                    return erro(res, 409, `Já existe uma categoria chamada "${dados.nome}".`, 'CATEGORIA_DUPLICADA');
                }
            }

            const categoria = await categoriaModel.atualizar(id, dados);
            if (!categoria) return erro(res, 404, 'Categoria não encontrada.');

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Categoria atualizada com sucesso.',
                dados: categoria
            });
        } catch (error) {
            return erroInterno(res, 'atualizarCategoria', error);
        }
    },

    async excluir(req, res) {
        try {
            const id = lerId(req);
            if (!id) return erro(res, 400, 'ID de categoria inválido.');

            const categoria = await categoriaModel.buscarPorId(id);
            if (!categoria) return erro(res, 404, 'Categoria não encontrada.');

            // A FK é ON DELETE RESTRICT: sem esta checagem o MySQL devolveria
            // um erro cru. Aqui o admin descobre quantos livros precisam mudar.
            const livros = await categoriaModel.contarLivros(id);
            if (livros > 0) {
                return erro(
                    res,
                    409,
                    `Esta categoria está em ${livros} ${livros === 1 ? 'livro' : 'livros'}. Reclassifique-os antes de excluí-la.`,
                    'CATEGORIA_EM_USO'
                );
            }

            await categoriaModel.excluir(id);

            return res.status(200).json({ sucesso: true, mensagem: 'Categoria excluída.' });
        } catch (error) {
            return erroInterno(res, 'excluirCategoria', error);
        }
    }
};
