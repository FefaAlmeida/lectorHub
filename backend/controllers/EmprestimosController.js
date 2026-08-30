import EmprestimoModel, {
    LIMITE_EMPRESTIMOS,
    PRAZO_DIAS
} from '../models/EmprestimosModel.js';
import { livroModel } from '../models/LivroModel.js';
import { erro, erroInterno } from '../utils/resposta.js';

const STATUS_VALIDOS = ['PENDENTE', 'EMPRESTADO', 'DEVOLVIDO', 'RECUSADO', 'CANCELADO'];

// Máquina de estados: de qual status o admin pode ir para qual.
// PENDENTE -> aprovado (EMPRESTADO) ou recusado; EMPRESTADO -> devolvido.
// CANCELADO só nasce da ação do próprio cliente (cancelarEmprestimo).
const TRANSICOES = {
    PENDENTE: ['EMPRESTADO', 'RECUSADO'],
    EMPRESTADO: ['DEVOLVIDO']
};

const PRAZO_MIN = 1;
const PRAZO_MAX = 90;

function lerId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Devolve o inteiro de dias ou null se estiver fora de 1..90.
function lerDias(valor, padrao) {
    if (valor === undefined || valor === null || valor === '') return padrao;
    const n = Number(valor);
    return Number.isInteger(n) && n >= PRAZO_MIN && n <= PRAZO_MAX ? n : null;
}

// --- REGRAS DE EMPRÉSTIMO ---
// 1. No máximo LIMITE_EMPRESTIMOS empréstimos ativos ao mesmo tempo.
// 2. Quem tem livro atrasado não pega outro até devolver.
async function verificarElegibilidade(idUsuario) {
    const [ativos, atrasados] = await Promise.all([
        EmprestimoModel.contarAtivos(idUsuario),
        EmprestimoModel.listarAtrasados(idUsuario)
    ]);

    const base = {
        ativos,
        limite: LIMITE_EMPRESTIMOS,
        vagas: Math.max(LIMITE_EMPRESTIMOS - ativos, 0),
        atrasados
    };

    if (atrasados.length > 0) {
        const titulos = atrasados.map((item) => item.titulo).join(', ');
        return {
            ...base,
            podeEmprestar: false,
            codigo: 'EMPRESTIMO_ATRASADO',
            motivo: `Você está com ${atrasados.length === 1 ? 'um livro atrasado' : 'livros atrasados'} (${titulos}). Devolva antes de solicitar outro empréstimo.`
        };
    }

    if (ativos >= LIMITE_EMPRESTIMOS) {
        return {
            ...base,
            podeEmprestar: false,
            codigo: 'LIMITE_ATINGIDO',
            motivo: `Você já tem ${ativos} empréstimos em andamento. O limite é de ${LIMITE_EMPRESTIMOS} por vez.`
        };
    }

    return { ...base, podeEmprestar: true, codigo: null, motivo: null };
}

class EmprestimoController {

    // --- CLIENTE ---

    static async minhaElegibilidade(req, res) {
        try {
            const elegibilidade = await verificarElegibilidade(req.usuario.id);
            return res.status(200).json({ sucesso: true, dados: elegibilidade });
        } catch (error) {
            return erroInterno(res, 'minhaElegibilidade', error);
        }
    }

    static async solicitarEmprestimo(req, res) {
        try {
            const idUsuario = req.usuario.id;
            const idLivro = lerId(req.body?.id_livro);

            if (!idLivro) return erro(res, 400, 'Informe um id_livro válido.');

            const livro = await livroModel.buscarPorId(idLivro);
            if (!livro) return erro(res, 404, 'Livro não encontrado.');

            if (!livro.disponivel) {
                return erro(res, 409, 'Este livro não está disponível no momento.', 'LIVRO_INDISPONIVEL');
            }

            const jaTem = await EmprestimoModel.possuiAtivoDoLivro(idUsuario, idLivro);
            if (jaTem) {
                return erro(
                    res,
                    409,
                    jaTem.status === 'PENDENTE'
                        ? 'Você já tem uma solicitação pendente para este livro.'
                        : 'Este livro já está com você.',
                    'JA_SOLICITADO'
                );
            }

            const elegibilidade = await verificarElegibilidade(idUsuario);
            if (!elegibilidade.podeEmprestar) {
                return res.status(409).json({
                    sucesso: false,
                    codigo: elegibilidade.codigo,
                    mensagem: elegibilidade.motivo,
                    dados: elegibilidade
                });
            }

            const idEmprestimo = await EmprestimoModel.criarSolicitacao(idUsuario, idLivro);
            const emprestimo = await EmprestimoModel.buscarPorId(idEmprestimo);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Solicitação registrada. Aguarde a aprovação da biblioteca.',
                dados: {
                    emprestimo,
                    elegibilidade: await verificarElegibilidade(idUsuario)
                }
            });
        } catch (error) {
            return erroInterno(res, 'solicitarEmprestimo', error);
        }
    }

    static async meusEmprestimos(req, res) {
        try {
            const [emprestimos, elegibilidade] = await Promise.all([
                EmprestimoModel.listarPorUsuario(req.usuario.id),
                verificarElegibilidade(req.usuario.id)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: { emprestimos, elegibilidade, prazo_dias: PRAZO_DIAS }
            });
        } catch (error) {
            return erroInterno(res, 'meusEmprestimos', error);
        }
    }

    // Cancelar a própria solicitação (só enquanto pendente)
    static async cancelarEmprestimo(req, res) {
        try {
            const id = lerId(req.params.id);
            if (!id) return erro(res, 400, 'ID de empréstimo inválido.');

            const emprestimo = await EmprestimoModel.buscarPorId(id);
            if (!emprestimo || emprestimo.id_usuario !== req.usuario.id) {
                return erro(res, 404, 'Empréstimo não encontrado.');
            }

            if (emprestimo.status !== 'PENDENTE') {
                return erro(res, 409, 'Só é possível cancelar solicitações que ainda estão pendentes.');
            }

            await EmprestimoModel.atualizarStatus(id, 'CANCELADO');

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação cancelada.',
                dados: { elegibilidade: await verificarElegibilidade(req.usuario.id) }
            });
        } catch (error) {
            return erroInterno(res, 'cancelarEmprestimo', error);
        }
    }

    // --- ADMIN ---

    static async listarEmprestimos(req, res) {
        try {
            const { status, pagina, limite } = req.query;

            let statusFiltro = '';
            if (status !== undefined && status !== '') {
                if (typeof status !== 'string') return erro(res, 400, 'Status inválido.');
                statusFiltro = status.trim().toUpperCase();
                if (!STATUS_VALIDOS.includes(statusFiltro)) {
                    return erro(res, 400, `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}.`);
                }
            }

            const resultado = await EmprestimoModel.listarTodos({ status: statusFiltro, pagina, limite });

            return res.status(200).json({
                sucesso: true,
                dados: resultado.emprestimos,
                paginacao: {
                    total: resultado.total,
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            return erroInterno(res, 'listarEmprestimos', error);
        }
    }

    // Alimenta o painel inteiro numa chamada só: contadores, ranking e série
    // mensal. São três consultas independentes, então vão em paralelo.
    static async resumo(req, res) {
        try {
            const [contadores, maisEmprestados, porMes] = await Promise.all([
                EmprestimoModel.resumo(),
                EmprestimoModel.maisEmprestados(5),
                EmprestimoModel.porMes(6)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: { ...contadores, mais_emprestados: maisEmprestados, por_mes: porMes }
            });
        } catch (error) {
            return erroInterno(res, 'resumo', error);
        }
    }

    // Aprovar (EMPRESTADO) / recusar / registrar devolução
    static async atualizarStatus(req, res) {
        try {
            const id = lerId(req.params.id);
            if (!id) return erro(res, 400, 'ID de empréstimo inválido.');

            const status = String(req.body?.status || '').trim().toUpperCase();
            if (!STATUS_VALIDOS.includes(status)) {
                return erro(res, 400, `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}.`);
            }

            const prazoDias = lerDias(req.body?.prazo_dias, PRAZO_DIAS);
            if (prazoDias === null) {
                return erro(res, 400, `prazo_dias deve ser um inteiro entre ${PRAZO_MIN} e ${PRAZO_MAX}.`);
            }

            const emprestimo = await EmprestimoModel.buscarPorId(id);
            if (!emprestimo) return erro(res, 404, 'Empréstimo não encontrado.');

            const permitidos = TRANSICOES[emprestimo.status] || [];
            if (!permitidos.includes(status)) {
                return erro(
                    res,
                    409,
                    `Não é possível mudar de ${emprestimo.status} para ${status}.`,
                    'TRANSICAO_INVALIDA'
                );
            }

            if (status === 'EMPRESTADO') {
                // O exemplar precisa estar na estante (outro pedido pode ter sido aprovado antes).
                const livro = await livroModel.buscarPorId(emprestimo.id_livro);
                if (!livro || !livro.disponivel) {
                    return erro(res, 409, 'Este livro não está disponível para empréstimo.', 'LIVRO_INDISPONIVEL');
                }

                // O próprio pedido PENDENTE já conta como ativo, por isso "acima do limite".
                const elegibilidade = await verificarElegibilidade(emprestimo.id_usuario);
                if (elegibilidade.atrasados.length > 0 || elegibilidade.ativos > LIMITE_EMPRESTIMOS) {
                    return erro(
                        res,
                        409,
                        `Não é possível aprovar: ${elegibilidade.motivo}`,
                        elegibilidade.codigo || 'LIMITE_ATINGIDO'
                    );
                }
            }

            await EmprestimoModel.atualizarStatus(id, status, prazoDias);

            // O livro sai da estante ao ser aprovado e volta ao ser devolvido.
            // Recusar não mexe no livro: ele nunca saiu.
            if (status === 'EMPRESTADO') {
                await livroModel.atualizarDisponibilidade(emprestimo.id_livro, false);
            } else if (status === 'DEVOLVIDO') {
                await livroModel.atualizarDisponibilidade(emprestimo.id_livro, true);
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Status do empréstimo atualizado.',
                dados: await EmprestimoModel.buscarPorId(id)
            });
        } catch (error) {
            return erroInterno(res, 'atualizarStatus', error);
        }
    }

    // Estender o prazo de um empréstimo em andamento
    static async estenderPrazo(req, res) {
        try {
            const id = lerId(req.params.id);
            if (!id) return erro(res, 400, 'ID de empréstimo inválido.');

            const dias = lerDias(req.body?.dias, null);
            if (dias === null) {
                return erro(res, 400, `dias deve ser um inteiro entre ${PRAZO_MIN} e ${PRAZO_MAX}.`);
            }

            const emprestimo = await EmprestimoModel.buscarPorId(id);
            if (!emprestimo) return erro(res, 404, 'Empréstimo não encontrado.');

            if (emprestimo.status !== 'EMPRESTADO') {
                return erro(res, 409, 'Só é possível estender o prazo de empréstimos em andamento.');
            }

            await EmprestimoModel.estenderPrazo(id, dias);

            return res.status(200).json({
                sucesso: true,
                mensagem: `Prazo estendido em ${dias} dia(s).`,
                dados: await EmprestimoModel.buscarPorId(id)
            });
        } catch (error) {
            return erroInterno(res, 'estenderPrazo', error);
        }
    }
}

export default EmprestimoController;
