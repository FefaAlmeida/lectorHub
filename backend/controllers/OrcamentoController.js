import OrcamentoModel from '../models/OrcamentoModel.js';
import crypto from "crypto";

class OrcamentoController {

    // GET /orcamentos
    static async listarTodos(req, res) {
        try {

            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser maior que zero'
                });
            }

            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser maior que zero'
                });
            }

            const offset = (pagina - 1) * limite;

            const resultado =
                await OrcamentoModel.listarTodos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.orcamentos,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });

        } catch (error) {

            console.error('Erro ao listar orçamentos:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // GET /orcamentos/:id
    static async buscarPorId(req, res) {
        try {

            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido'
                });
            }

            const orcamento =
                await OrcamentoModel.buscarPorId(id);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Orçamento não encontrado'
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: orcamento
            });

        } catch (error) {

            console.error('Erro ao buscar orçamento:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // GET /orcamentos/email/:email
    static async buscarPorEmail(req, res) {
        try {

            const { email } = req.params;

            const orcamentos =
                await OrcamentoModel.buscarPorEmail(email);

            res.status(200).json({
                sucesso: true,
                dados: orcamentos
            });

        } catch (error) {

            console.error('Erro ao buscar orçamento por email:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // POST /orcamentos
    static async criar(req, res) {
        try {

            const {
                nome_empresa,
                nome_responsavel,
                email_contato,
                cidade,
                estado,
                quantidade_placas,
                modelo_placa
            } = req.body;

            const erros = [];

            if (!nome_empresa || nome_empresa.trim() === '') {
                erros.push({
                    campo: 'nome_empresa',
                    mensagem: 'Nome da empresa é obrigatório'
                });
            }

            if (!nome_responsavel || nome_responsavel.trim() === '') {
                erros.push({
                    campo: 'nome_responsavel',
                    mensagem: 'Nome do responsável é obrigatório'
                });
            }

            if (!email_contato || email_contato.trim() === '') {
                erros.push({
                    campo: 'email_contato',
                    mensagem: 'Email é obrigatório'
                });
            }

            if (!cidade || cidade.trim() === '') {
                erros.push({
                    campo: 'cidade',
                    mensagem: 'Cidade é obrigatória'
                });
            }

            if (!estado || estado.trim() === '') {
                erros.push({
                    campo: 'estado',
                    mensagem: 'Estado é obrigatório'
                });
            }

            if (!quantidade_placas || quantidade_placas <= 0) {
                erros.push({
                    campo: 'quantidade_placas',
                    mensagem: 'Quantidade de placas inválida'
                });
            }

            if (Number(quantidade_placas) > 500) {
                erros.push({
                    campo: 'quantidade_placas',
                    mensagem: 'Quantidade máxima permitida de 500 placas.'
                });
            }

            if (!modelo_placa) {
                erros.push({
                    campo: 'modelo_placa',
                    mensagem: 'Modelo da placa é obrigatório'
                });
            }

            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    detalhes: erros
                });
            }

            const tabelaPrecos = {
                CANADIAN_550W: 900,
                JINKO_600W: 1000,
                TRINA_575W: 950,
                LONGI_650W: 1200
            };

            const tabelaPotencia = {
                CANADIAN_550W: 550,
                JINKO_600W: 600,
                TRINA_575W: 575,
                LONGI_650W: 650
            };

            if (!tabelaPrecos[modelo_placa]) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Modelo de placa inválido'
                });
            }

            const valorPlacas =
                Number(quantidade_placas) *
                tabelaPrecos[modelo_placa];

            const valorInstalacao =
                valorPlacas * 0.25;

            const valorTotal =
                valorPlacas + valorInstalacao;

            const potenciaEstimada =
                (Number(quantidade_placas) *
                    tabelaPotencia[modelo_placa]) / 1000;

            const economiaEstimada =
                valorTotal * 0.15;

            const dadosOrcamento = {
                nome_empresa: nome_empresa.trim(),
                nome_responsavel: nome_responsavel.trim(),
                email_contato: email_contato.trim(),
                cidade: cidade.trim(),
                estado: estado.trim().toUpperCase(),
                quantidade_placas: parseInt(quantidade_placas),
                modelo_placa,

                potencia_estimada: potenciaEstimada,
                economia_estimada: economiaEstimada,
                valor_instalacao: valorInstalacao,
                valor_placas: valorPlacas,
                valor_total: valorTotal
            };

            const id =
                await OrcamentoModel.criar(dadosOrcamento);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Solicitação enviada com sucesso',
                dados: {
                    id,
                    ...dadosOrcamento,
                    status_solicitacao: 'PENDENTE'
                }
            });

        } catch (error) {

            console.error('Erro ao criar orçamento:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // PUT /orcamentos/:id
    static async atualizar(req, res) {
        try {

            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido'
                });
            }

            const orcamento =
                await OrcamentoModel.buscarPorId(id);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Orçamento não encontrado'
                });
            }

            const resultado =
                await OrcamentoModel.atualizar(id, req.body);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Orçamento atualizado com sucesso',
                dados: resultado
            });

        } catch (error) {

            console.error('Erro ao atualizar orçamento:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // DELETE /orcamentos/:id
    static async excluir(req, res) {
        try {

            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido'
                });
            }

            const orcamento =
                await OrcamentoModel.buscarPorId(id);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Orçamento não encontrado'
                });
            }

            await OrcamentoModel.excluir(id);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Orçamento excluído com sucesso'
            });

        } catch (error) {

            console.error('Erro ao excluir orçamento:', error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // PATCH /orcamentos/:id/aceitar
    static async aceitar(req, res) {
        try {
            const { id } = req.params;

            const orcamento = await OrcamentoModel.buscarPorId(id);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Orçamento não encontrado'
                });
            }

            if (orcamento.status_solicitacao !== 'PENDENTE') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Orçamento já foi processado'
                });
            }

            const token = crypto.randomUUID();

            await OrcamentoModel.atualizar(id, {
                status_solicitacao: 'ACEITA',
                token_cadastro: token
            });

            const dadosCliente = await OrcamentoModel.prepararDadosCliente(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Orçamento aceito com sucesso',
                dados: {
                    token,
                    id_solicitacao: id,
                    ...dadosCliente
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // PATCH /orcamentos/:id/recusar
    static async recusar(req, res) {
        try {

            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido'
                });
            }

            const orcamento =
                await OrcamentoModel.buscarPorId(id);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Orçamento não encontrado'
                });
            }

            if (orcamento.status_solicitacao === 'RECUSADA') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Este orçamento já foi recusado'
                });
            }

            if (orcamento.status_solicitacao === 'ACEITA') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Este orçamento já foi aceito'
                });
            }

            await OrcamentoModel.atualizar(id, {
                status_solicitacao: 'RECUSADA'
            });

            res.status(200).json({
                sucesso: true,
                mensagem: 'Orçamento recusado com sucesso'
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    static async validarToken(req, res) {
        try {
            const { token } = req.params;

            const orcamento = await OrcamentoModel.buscarPorToken(token);

            if (!orcamento) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Token inválido ou orçamento não aceito'
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: {
                    id_solicitacao: orcamento.id_solicitacao,
                    nome_responsavel: orcamento.nome_responsavel,
                    email_contato: orcamento.email_contato
                }
            });

        } catch (error) {
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }
}

export default OrcamentoController;