import EmprestimoModel, {
    LIMITE_EMPRESTIMOS,
    PRAZO_DIAS
} from "../models/EmprestimosModel.js";
import { livroModel } from "../models/LivroModel.js";

const STATUS_VALIDOS = [
    'PENDENTE',
    'EMPRESTADO',
    'DEVOLVIDO',
    'RECUSADO',
    'CANCELADO'
];

function lerId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// --- REGRAS DE EMPRÉSTIMO ---
// 1. No máximo LIMITE_EMPRESTIMOS empréstimos ativos ao mesmo tempo.
// 2. Quem tem livro atrasado não pega outro até devolver.
// Fica isolado aqui porque é consultado em dois lugares: antes de criar o
// pedido e pela tela, que precisa avisar o usuário ANTES de ele clicar.
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

    return {
        ...base,
        podeEmprestar: true,
        codigo: null,
        motivo: null
    };
}

class EmprestimoController {

    // CONSULTAR SE O USUÁRIO PODE PEGAR OUTRO LIVRO
    static async minhaElegibilidade(req, res) {
        try {
            const elegibilidade = await verificarElegibilidade(req.usuario.id);

            return res.status(200).json({
                sucesso: true,
                dados: elegibilidade
            });

        } catch (error) {
            console.error('Erro ao verificar elegibilidade:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao verificar elegibilidade para empréstimo.'
            });
        }
    }

    // SOLICITAR EMPRÉSTIMO
    static async solicitarEmprestimo(req, res) {
        try {
            const idUsuario = req.usuario.id;
            const idLivro = lerId(req.body?.id_livro);

            if (!idLivro) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe um id_livro válido.'
                });
            }

            const livro = await livroModel.buscarPorId(idLivro);

            if (!livro) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Livro não encontrado.'
                });
            }

            if (!livro.disponivel) {
                return res.status(409).json({
                    sucesso: false,
                    codigo: 'LIVRO_INDISPONIVEL',
                    mensagem: 'Este livro não está disponível no momento.'
                });
            }

            const jaTem = await EmprestimoModel.possuiAtivoDoLivro(idUsuario, idLivro);

            if (jaTem) {
                return res.status(409).json({
                    sucesso: false,
                    codigo: 'JA_SOLICITADO',
                    mensagem:
                        jaTem.status === 'PENDENTE'
                            ? 'Você já tem uma solicitação pendente para este livro.'
                            : 'Este livro já está com você.'
                });
            }

            const elegibilidade = await verificarElegibilidade(idUsuario);

            // 409: o pedido é válido, mas o estado atual do usuário o impede.
            if (!elegibilidade.podeEmprestar) {
                return res.status(409).json({
                    sucesso: false,
                    codigo: elegibilidade.codigo,
                    mensagem: elegibilidade.motivo,
                    dados: elegibilidade
                });
            }

            const idEmprestimo = await EmprestimoModel.criarSolicitacao(
                idUsuario,
                idLivro
            );

            const emprestimo = await EmprestimoModel.buscarPorId(idEmprestimo);

            return res.status(201).json({
                sucesso: true,
                mensagem:
                    'Solicitação registrada. Aguarde a aprovação da biblioteca.',
                dados: {
                    emprestimo,
                    elegibilidade: await verificarElegibilidade(idUsuario)
                }
            });

        } catch (error) {
            console.error('Erro ao registrar empréstimo:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao registrar empréstimo.'
            });
        }
    }

    // MEUS EMPRÉSTIMOS
    static async meusEmprestimos(req, res) {
        try {
            const [emprestimos, elegibilidade] = await Promise.all([
                EmprestimoModel.listarPorUsuario(req.usuario.id),
                verificarElegibilidade(req.usuario.id)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    emprestimos,
                    elegibilidade,
                    prazo_dias: PRAZO_DIAS
                }
            });

        } catch (error) {
            console.error('Erro ao listar empréstimos do usuário:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar seus empréstimos.'
            });
        }
    }

    // CANCELAR A PRÓPRIA SOLICITAÇÃO (só enquanto pendente)
    static async cancelarEmprestimo(req, res) {
        try {
            const id = lerId(req.params.id);

            if (!id) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'ID de empréstimo inválido.'
                });
            }

            const emprestimo = await EmprestimoModel.buscarPorId(id);

            if (!emprestimo || emprestimo.id_usuario !== req.usuario.id) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Empréstimo não encontrado.'
                });
            }

            if (emprestimo.status !== 'PENDENTE') {
                return res.status(409).json({
                    sucesso: false,
                    mensagem:
                        'Só é possível cancelar solicitações que ainda estão pendentes.'
                });
            }

            await EmprestimoModel.atualizarStatus(id, 'CANCELADO');

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação cancelada.',
                dados: {
                    elegibilidade: await verificarElegibilidade(req.usuario.id)
                }
            });

        } catch (error) {
            console.error('Erro ao cancelar empréstimo:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao cancelar empréstimo.'
            });
        }
    }

    // ÚLTIMO EMPRÉSTIMO — o usuário só enxerga o próprio; admin vê qualquer um.
    static async buscarUltimoEmprestimo(req, res) {
        try {
            const idUsuario = lerId(req.params.id_usuario);

            if (!idUsuario) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'ID do usuário inválido.'
                });
            }

            if (idUsuario !== req.usuario.id && req.usuario.tipo !== 'admin') {
                return res.status(403).json({
                    sucesso: false,
                    mensagem: 'Você só pode consultar os próprios empréstimos.'
                });
            }

            const emprestimo = await EmprestimoModel.buscarUltimoPorUsuario(idUsuario);

            if (!emprestimo) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhum empréstimo encontrado para este usuário.'
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: emprestimo
            });

        } catch (error) {
            console.error('Erro ao buscar último empréstimo:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar último empréstimo.'
            });
        }
    }

    // --- ADMIN ---

    static async listarEmprestimos(req, res) {
        try {
            const { status, pagina, limite } = req.query;

            const resultado = await EmprestimoModel.listarTodos({
                status: status?.trim().toUpperCase() || '',
                pagina,
                limite
            });

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
            console.error('Erro ao listar empréstimos:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar empréstimos.'
            });
        }
    }

    static async totalEmprestados(req, res) {
        try {
            const total = await EmprestimoModel.totalEmprestados();

            return res.status(200).json({ sucesso: true, total });

        } catch (error) {
            console.error('Erro ao buscar total de empréstimos:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar total de empréstimos.'
            });
        }
    }

    // APROVAR / RECUSAR / REGISTRAR DEVOLUÇÃO
    static async atualizarStatus(req, res) {
        try {
            const id = lerId(req.params.id);

            if (!id) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'ID de empréstimo inválido.'
                });
            }

            const status = String(req.body?.status || '').trim().toUpperCase();

            if (!STATUS_VALIDOS.includes(status)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}.`
                });
            }

            const emprestimo = await EmprestimoModel.buscarPorId(id);

            if (!emprestimo) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Empréstimo não encontrado.'
                });
            }

            // Aprovar um pedido de quem ficou inelegível no meio do caminho
            // furaria a regra pela porta dos fundos.
            if (status === 'EMPRESTADO' && emprestimo.status !== 'EMPRESTADO') {
                const elegibilidade = await verificarElegibilidade(emprestimo.id_usuario);

                // O próprio pedido em análise já conta como ativo, por isso a
                // comparação usa "acima do limite" e não "no limite".
                const excedeLimite = elegibilidade.ativos > LIMITE_EMPRESTIMOS;

                if (elegibilidade.atrasados.length > 0 || excedeLimite) {
                    return res.status(409).json({
                        sucesso: false,
                        codigo: elegibilidade.codigo || 'LIMITE_ATINGIDO',
                        mensagem: `Não é possível aprovar: ${elegibilidade.motivo}`
                    });
                }
            }

            const prazoDias = Number(req.body?.prazo_dias) || PRAZO_DIAS;

            await EmprestimoModel.atualizarStatus(id, status, prazoDias);

            // O livro sai e volta do acervo junto com o empréstimo.
            if (status === 'EMPRESTADO') {
                await livroModel.atualizarDisponibilidade(emprestimo.id_livro, false);
            } else if (['DEVOLVIDO', 'RECUSADO', 'CANCELADO'].includes(status)) {
                await livroModel.atualizarDisponibilidade(emprestimo.id_livro, true);
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Status do empréstimo atualizado.',
                dados: await EmprestimoModel.buscarPorId(id)
            });

        } catch (error) {
            console.error('Erro ao atualizar status do empréstimo:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar status do empréstimo.'
            });
        }
    }
}

export default EmprestimoController;
