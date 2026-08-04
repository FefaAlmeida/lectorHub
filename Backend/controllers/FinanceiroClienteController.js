import FinanceiroClienteModel from '../models/FinanceiroClienteModel.js';

class FinanceiroClienteController {

    // Método definitivo: Busca os vínculos do usuário direto na tabela 'usuarios'
    static async obterDadosUsuarioLogado(req) {
        const alvo = req.usuario || req.user || {};
        const email_usuario_logado = alvo.email; 

        if (!email_usuario_logado) return null;

        try {
            const { getConnection } = await import('../config/database.js');
            const db = await getConnection();
            
            // Puxamos ambos os IDs que estão na tabela de usuários
            const query = `SELECT id_solicitacao, id_empresa FROM usuarios WHERE email = ? LIMIT 1`;
            const [rows] = await db.execute(query, [email_usuario_logado]);
            db.release();

            if (rows.length > 0) {
                return {
                    id_solicitacao: rows[0].id_solicitacao,
                    id_empresa: rows[0].id_empresa
                };
            } else {
                console.warn(`AVISO: Usuário ${email_usuario_logado} não encontrado na tabela usuarios.`);
            }
        } catch (e) {
            console.error("Erro ao buscar dados do usuário por e-mail:", e);
        }

        return null; 
    }

    // GET /cliente/financeiro
    static async obterPainel(req, res) {
        try {
            const dadosUser = await FinanceiroClienteController.obterDadosUsuarioLogado(req);
            
            if (!dadosUser || !dadosUser.id_empresa) {
                return res.status(401).json({ sucesso: false, erro: 'Dados do usuário ou empresa não identificados.' });
            }

            const { id_solicitacao, id_empresa } = dadosUser;
            
            let pagina = Math.max(1, parseInt(req.query.pagina) || 1);
            let limite = Math.max(1, parseInt(req.query.limite) || 12);
            const offset = (pagina - 1) * limite;

            const statusValidos = ['PENDENTE', 'PAGO', 'ATRASADO'];
            const status = req.query.status && statusValidos.includes(req.query.status.toUpperCase())
                ? req.query.status.toUpperCase()
                : null;

            try {
                await FinanceiroClienteModel.sincronizarAtrasadosPorEmpresa(id_empresa);
            } catch (errSync) {
                console.error("Aviso: Falha temporária ao sincronizar faturas atrasadas:", errSync.message);
            }

            const jaConfigurou = await FinanceiroClienteModel.verificarSeJaTemParcelas(id_empresa);

            if (!jaConfigurou) {
                if (!id_solicitacao) {
                    return res.status(200).json({
                        sucesso: false,
                        requerSetup: true,
                        erro: 'Nenhum orçamento aceito foi vinculado ao seu usuário ainda.'
                    });
                }

                // Busca o valor do orçamento aceito usando o id_solicitacao vindo de 'usuarios'
                const orcamento = await FinanceiroClienteModel.obterOrcamentoAprovado(id_solicitacao);
                
                if (!orcamento) {
                    return res.status(200).json({
                        sucesso: false,
                        requerSetup: true,
                        erro: 'Orçamento aceito correspondente não foi localizado.'
                    });
                }

                return res.status(200).json({
                    sucesso: true,
                    requerSetup: true,
                    mensagem: 'Defina o seu parcelamento inicial baseado no seu orçamento aceito.',
                    orcamento: { valor_total: parseFloat(orcamento.valor_total) }
                });
            }

            // Se já configurou, lista os pagamentos usando o id_empresa
            const resultado = await FinanceiroClienteModel.listarPorEmpresa({ id_empresa, limite, offset, status });
            const resumoBruto = await FinanceiroClienteModel.obterResumoCliente(id_empresa) || {};

            const resumoSuavizado = {
                totalRecebido: parseFloat(resumoBruto.totalPago) || 0,
                totalPendente: parseFloat(resumoBruto.totalPendente) || 0,
                totalAtrasado: parseFloat(resumoBruto.totalAtrasado) || 0,
                qtdRecebidos: parseInt(resumoBruto.qtdRecebidos) || 0,
                qtdPendentes: parseInt(resumoBruto.qtdPendentes) || 0,
                qtdAtrasados: parseInt(resumoBruto.quantidadeAtrasada) || 0,
                totalRegistros: parseInt(resultado.total) || 0
            };

            return res.status(200).json({
                sucesso: true,
                requerSetup: false,
                dados: resultado.pagamentos || [],
                resumo: resumoSuavizado,
                paginacao: {
                    pagina,
                    limite,
                    total: resultado.total || 0,
                    totalPaginas: Math.ceil((resultado.total || 0) / limite)
                }
            });

        } catch (error) {
            console.error('Erro crítico no painel financeiro:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno ao carregar o painel financeiro.' });
        }
    }

    // POST /cliente/financeiro/setup
    static async inicializarParcelamento(req, res) {
        try {
            const dadosUser = await FinanceiroClienteController.obterDadosUsuarioLogado(req);
            if (!dadosUser || !dadosUser.id_empresa || !dadosUser.id_solicitacao) {
                return res.status(401).json({ sucesso: false, erro: 'Vínculos de empresa ou orçamento não localizados no seu perfil.' });
            }

            const { id_solicitacao, id_empresa } = dadosUser;
            const { quantidade_parcelas, forma_pagamento } = req.body;
            const formasValidas = ['BOLETO', 'PIX', 'CARTAO'];
            const qtdParcelasNum = parseInt(quantidade_parcelas);

            if (!qtdParcelasNum || qtdParcelasNum <= 0 || qtdParcelasNum > 240 || !forma_pagamento || !formasValidas.includes(forma_pagamento.toUpperCase())) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Quantidade de parcelas inválida ou forma de pagamento incorreta.' 
                });
            }

            const jaExiste = await FinanceiroClienteModel.verificarSeJaTemParcelas(id_empresa);
            if (jaExiste) {
                return res.status(403).json({ sucesso: false, erro: 'O parcelamento já foi inicializado.' });
            }

            // Puxa o orçamento usando o id_solicitacao que veio de 'usuarios'
            const orcamento = await FinanceiroClienteModel.obterOrcamentoAprovado(id_solicitacao);
            if (!orcamento) {
                return res.status(404).json({ sucesso: false, erro: 'Dados do orçamento aprovado não encontrados.' });
            }

            const valorTotal = parseFloat(orcamento.valor_total);
            const valorParcelaBase = (valorTotal / qtdParcelasNum).toFixed(2);
            
            let parcelasParaInserir = [];
            let dataVencimentoBase = new Date();

            for (let i = 1; i <= qtdParcelasNum; i++) {
                let dataVencimento = new Date();
                dataVencimento.setDate(dataVencimentoBase.getDate() + (30 * i));

                let valorFinalParcela = parseFloat(valorParcelaBase);
                if (i === qtdParcelasNum) {
                    const somaAnteriores = parseFloat(valorParcelaBase) * (qtdParcelasNum - 1);
                    valorFinalParcela = parseFloat((valorTotal - somaAnteriores).toFixed(2));
                }

                parcelasParaInserir.push({
                    valor: valorFinalParcela,
                    tipo_pagamento: 'PLACAS',
                    numero_parcela: i,
                    quantidade_parcelas: qtdParcelasNum,
                    forma_pagamento: forma_pagamento.toUpperCase(),
                    data_vencimento: dataVencimento.toISOString().split('T')[0]
                });
            }

            // Salva na tabela pagamentos usando o id_empresa do cliente
            await FinanceiroClienteModel.gerarParcelas(id_empresa, parcelasParaInserir);
            return res.status(201).json({ sucesso: true, mensagem: 'Parcelamento gerado com sucesso!' });

        } catch (error) {
            console.error('Erro ao gerar parcelas:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno ao processar o parcelamento.' });
        }
    }

    // PATCH /cliente/financeiro/forma-pagamento
    static async alterarMetodoPagamento(req, res) {
        try {
            const dadosUser = await FinanceiroClienteController.obterDadosUsuarioLogado(req);
            if (!dadosUser || !dadosUser.id_empresa) return res.status(401).json({ sucesso: false, erro: 'Não autenticado.' });
            
            const formatoRecebido = req.body.forma_pagamento || req.body.metodoGlobal;
            if (!formatoRecebido) return res.status(400).json({ sucesso: false, erro: 'Forma de pagamento não fornecida.' });

            await FinanceiroClienteModel.alterarFormaPagamentoFutura(dadosUser.id_empresa, formatoRecebido.toUpperCase());
            return res.status(200).json({ sucesso: true, mensagem: 'Método de pagamento alterado!' });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar forma de pagamento.' });
        }
    }

    // POST /cliente/financeiro/:id/pagar
    static async pagarParcela(req, res) {
        try {
            const dadosUser = await FinanceiroClienteController.obterDadosUsuarioLogado(req);
            if (!dadosUser || !dadosUser.id_empresa) return res.status(401).json({ sucesso: false, erro: 'Não autenticado.' });
            
            const { id } = req.params;
            const sucesso = await FinanceiroClienteModel.registrarPagamento(id, dadosUser.id_empresa);
            if (!sucesso) return res.status(400).json({ sucesso: false, erro: 'Não foi possível processar o pagamento.' });

            return res.status(200).json({ sucesso: true, mensagem: 'Pagamento homologado!' });
        } catch (error) {
            return res.status(500).json({ sucesso: false, erro: 'Erro interno ao processar pagamento.' });
        }
    }
}

export default FinanceiroClienteController;