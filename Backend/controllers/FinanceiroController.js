import FinanceiroModel from '../models/FinanceiroModel.js';

class FinanceiroController {

    // GET /financeiro (Visão: ADMINISTRADOR)
    // Lista global de todas as parcelas/pagamentos com paginação, filtros e resumo de indicadores.
    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0 || limite <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'Parâmetros de paginação inválidos.' });
            }

            // Filtros opcionais validados contra os ENUMs da tabela
            const statusValidos = ['PENDENTE', 'PAGO', 'ATRASADO'];
            const tiposValidos = ['INSTALACAO', 'PLACAS'];

            const status = req.query.status && statusValidos.includes(req.query.status.toUpperCase())
                ? req.query.status.toUpperCase()
                : null;
            const tipo = req.query.tipo && tiposValidos.includes(req.query.tipo.toUpperCase())
                ? req.query.tipo.toUpperCase()
                : null;

            const offset = (pagina - 1) * limite;

            // Atualiza parcelas vencidas para ATRASADO antes de listar/somar
            await FinanceiroModel.sincronizarAtrasados();

            const resultado = await FinanceiroModel.listarTodos({ limite, offset, status, tipo });
            const resumo = await FinanceiroModel.obterResumo();

            return res.status(200).json({
                sucesso: true,
                dados: resultado.pagamentos,
                resumo,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar pagamentos globais no Admin:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // PATCH /financeiro/:id/status (Visão: ADMINISTRADOR)
    // Admin confirma o recebimento (dá baixa) ou reabre uma parcela.
    static async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status_pagamento } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID do pagamento inválido.' });
            }

            const statusValidos = ['PENDENTE', 'PAGO', 'ATRASADO'];
            if (!status_pagamento || !statusValidos.includes(status_pagamento.toUpperCase())) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Status inválido. Use PENDENTE, PAGO ou ATRASADO.'
                });
            }

            const pagamento = await FinanceiroModel.buscarPorId(id);
            if (!pagamento) {
                return res.status(404).json({ sucesso: false, erro: 'Pagamento não encontrado.' });
            }

            await FinanceiroModel.atualizarStatus(id, status_pagamento.toUpperCase());

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Situação do pagamento atualizada com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao atualizar status do pagamento:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
}

export default FinanceiroController;
