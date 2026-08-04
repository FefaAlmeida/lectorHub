import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class OrcamentoModel {

    static async listarTodos(limite, offset) {
        try {

            const connection = await getConnection();

            try {

                const sql = `
                    SELECT *
                    FROM solicitacoes_orcamentos
                    ORDER BY id_solicitacao DESC
                    LIMIT ? OFFSET ?
                `;

                const [orcamentos] = await connection.query(
                    sql,
                    [limite, offset]
                );

                const [totalResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM solicitacoes_orcamentos'
                );

                const total = totalResult[0].total;

                return {
                    orcamentos,
                    total,
                    pagina: (offset / limite) + 1,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };

            } finally {
                connection.release();
            }

        } catch (error) {
            console.error('Erro ao listar orçamentos:', error);
            throw error;
        }
    }

    static async buscarPorId(id) {
        try {

            const rows = await read(
                'solicitacoes_orcamentos',
                `id_solicitacao = ${id}`
            );

            return rows[0] || null;

        } catch (error) {
            console.error('Erro ao buscar orçamento:', error);
            throw error;
        }
    }

    static async buscarPorEmail(email) {
        try {

            return await read(
                'solicitacoes_orcamentos',
                `email_contato = '${email}'`
            );

        } catch (error) {
            console.error('Erro ao buscar orçamento por email:', error);
            throw error;
        }
    }

    static async listarPendentes() {
        try {

            return await read(
                'solicitacoes_orcamentos',
                "status_solicitacao = 'PENDENTE'"
            );

        } catch (error) {
            console.error('Erro ao listar pendentes:', error);
            throw error;
        }
    }

    static async listarAceitas() {
        try {

            return await read(
                'solicitacoes_orcamentos',
                "status_solicitacao = 'ACEITA'"
            );

        } catch (error) {
            console.error('Erro ao listar aceitas:', error);
            throw error;
        }
    }

    static async listarRecusadas() {
        try {

            return await read(
                'solicitacoes_orcamentos',
                "status_solicitacao = 'RECUSADA'"
            );

        } catch (error) {
            console.error('Erro ao listar recusadas:', error);
            throw error;
        }
    }

    static async criar(dadosOrcamento) {
        try {

            return await create(
                'solicitacoes_orcamentos',
                dadosOrcamento
            );

        } catch (error) {
            console.error('Erro ao criar orçamento:', error);
            throw error;
        }
    }

    static async atualizar(id, dadosOrcamento) {
        try {

            return await update(
                'solicitacoes_orcamentos',
                dadosOrcamento,
                `id_solicitacao = ${id}`
            );

        } catch (error) {
            console.error('Erro ao atualizar orçamento:', error);
            throw error;
        }
    }

    static async excluir(id) {
        try {

            return await deleteRecord(
                'solicitacoes_orcamentos',
                `id_solicitacao = ${id}`
            );

        } catch (error) {
            console.error('Erro ao excluir orçamento:', error);
            throw error;
        }
    }

    static async salvarToken(id_solicitacao, token) {
        const connection = await getConnection();

        try {
            const sql = `
                UPDATE solicitacoes_orcamentos
                SET token_cadastro = ?
                WHERE id_solicitacao = ?
            `;

            await connection.execute(sql, [
                token,
                id_solicitacao
            ]);

        } finally {
            connection.release();
        }
    }

    static async buscarPorToken(token) {
        const connection = await getConnection();

        try {

            const sql = `
                SELECT *
                FROM solicitacoes_orcamentos
                WHERE token_cadastro = ?
                AND status_solicitacao = 'ACEITA'
                LIMIT 1
            `;

            const [rows] = await connection.execute(
                sql,
                [token]
            );

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    static async invalidarToken(token) {
        const connection = await getConnection();

        try {

            const sql = `
                UPDATE solicitacoes_orcamentos
                SET token_cadastro = NULL
                WHERE token_cadastro = ?
            `;

            await connection.execute(sql, [token]);

        } finally {
            connection.release();
        }
    }

    static gerarDocumentoUnico(id_solicitacao) {
        return String(id_solicitacao).padStart(14, '0');
    }

    static gerarTelefoneUnico(id_solicitacao) {
        return `119${String(id_solicitacao).padStart(8, '0')}`;
    }

    static gerarValorAleatorio(min, max) {
        return Number((Math.random() * (max - min) + min).toFixed(2));
    }

    static gerarDataComMesesDeDiferenca(meses) {
        const data = new Date();
        data.setMonth(data.getMonth() + meses);
        return data;
    }

    static obterPotenciaModelo(modelo) {
        const potencias = {
            CANADIAN_550W: 550,
            JINKO_600W: 600,
            TRINA_575W: 575,
            LONGI_650W: 650
        };

        return potencias[modelo] || 550;
    }

    static async buscarEmpresaPorEmail(email) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT *
                FROM empresa_clientes
                WHERE email_principal = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [email]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    static async prepararDadosCliente(id_solicitacao) {
        const connection = await getConnection();

        try {
            await connection.beginTransaction();

            const [orcamentoRows] = await connection.execute(
                `
                    SELECT *
                    FROM solicitacoes_orcamentos
                    WHERE id_solicitacao = ?
                    LIMIT 1
                `,
                [id_solicitacao]
            );

            const orcamento = orcamentoRows[0];

            if (!orcamento) {
                throw new Error('Orçamento não encontrado');
            }

            const [empresaExistente] = await connection.execute(
                `
                    SELECT id_empresa
                    FROM empresa_clientes
                    WHERE email_principal = ?
                    LIMIT 1
                `,
                [orcamento.email_contato]
            );

            let idEmpresa = empresaExistente[0]?.id_empresa;

            if (!idEmpresa) {
                const [empresaResult] = await connection.execute(
                    `
                        INSERT INTO empresa_clientes (
                            nome_empresa,
                            cnpj,
                            telefone_principal,
                            email_principal,
                            status_empresa
                        )
                        VALUES (?, ?, ?, ?, 'ATIVA')
                    `,
                    [
                        orcamento.nome_empresa,
                        this.gerarDocumentoUnico(id_solicitacao),
                        this.gerarTelefoneUnico(id_solicitacao),
                        orcamento.email_contato
                    ]
                );

                idEmpresa = empresaResult.insertId;
            }

            const [enderecoExistente] = await connection.execute(
                `
                    SELECT id_endereco
                    FROM enderecos
                    WHERE id_empresa = ?
                    LIMIT 1
                `,
                [idEmpresa]
            );

            let idEndereco = enderecoExistente[0]?.id_endereco;

            if (!idEndereco) {
                const [enderecoResult] = await connection.execute(
                    `
                        INSERT INTO enderecos (
                            id_empresa,
                            logradouro,
                            numero,
                            bairro,
                            cidade,
                            estado,
                            cep,
                            complemento
                        )
                        VALUES (?, 'Endereço a definir', 'S/N', 'Centro', ?, ?, NULL, 'Criado automaticamente pelo aceite do orçamento')
                    `,
                    [
                        idEmpresa,
                        orcamento.cidade,
                        orcamento.estado
                    ]
                );

                idEndereco = enderecoResult.insertId;
            }

            const [instalacaoExistente] = await connection.execute(
                `
                    SELECT id_instalacao
                    FROM instalacoes
                    WHERE id_empresa = ?
                    LIMIT 1
                `,
                [idEmpresa]
            );

            if (instalacaoExistente.length > 0) {
                const idInstalacaoExistente = instalacaoExistente[0].id_instalacao;

                const [placasRows] = await connection.execute(
                    'SELECT COUNT(*) AS total FROM placas_solares WHERE id_empresa = ?',
                    [idEmpresa]
                );

                const [pagamentosRows] = await connection.execute(
                    'SELECT COUNT(*) AS total FROM pagamentos WHERE id_empresa = ?',
                    [idEmpresa]
                );

                await connection.commit();

                return {
                    id_empresa: idEmpresa,
                    id_endereco: idEndereco,
                    id_instalacao: idInstalacaoExistente,
                    total_placas: placasRows[0]?.total || 0,
                    total_parcelas: pagamentosRows[0]?.total || 0
                };
            }

            const [instalacaoResult] = await connection.execute(
                `
                    INSERT INTO instalacoes (
                        id_empresa,
                        id_tecnico,
                        id_endereco,
                        data_instalacao,
                        status_instalacao
                    )
                    VALUES (?, NULL, ?, CURRENT_DATE(), 'FINALIZADA')
                `,
                [idEmpresa, idEndereco]
            );

            const idInstalacao = instalacaoResult.insertId;
            const potenciaWatts = this.obterPotenciaModelo(orcamento.modelo_placa);
            const idsPlacas = [];

            for (let i = 0; i < Number(orcamento.quantidade_placas); i++) {
                const [placaResult] = await connection.execute(
                    `
                        INSERT INTO placas_solares (
                            id_empresa,
                            id_instalacao,
                            modelo,
                            potencia_watts,
                            status_placa,
                            data_instalacao
                        )
                        VALUES (?, ?, ?, ?, 'ATIVA', CURRENT_DATE())
                    `,
                    [
                        idEmpresa,
                        idInstalacao,
                        orcamento.modelo_placa,
                        potenciaWatts
                    ]
                );

                idsPlacas.push(placaResult.insertId);
            }

            const quantidadeParcelas = 12;
            const valorParcela = Number((Number(orcamento.valor_total || 0) / quantidadeParcelas).toFixed(2));

            for (let parcela = 1; parcela <= quantidadeParcelas; parcela++) {
                const statusPagamento = parcela <= 2 ? 'PAGO' : 'PENDENTE';
                const dataVencimento = this.gerarDataComMesesDeDiferenca(parcela - 2);
                const dataPagamento = statusPagamento === 'PAGO'
                    ? this.gerarDataComMesesDeDiferenca(parcela - 2)
                    : null;

                await connection.execute(
                    `
                        INSERT INTO pagamentos (
                            id_empresa,
                            valor,
                            tipo_pagamento,
                            numero_parcela,
                            quantidade_parcelas,
                            status_pagamento,
                            forma_pagamento,
                            data_vencimento,
                            data_pagamento
                        )
                        VALUES (?, ?, 'PLACAS', ?, ?, ?, 'PIX', ?, ?)
                    `,
                    [
                        idEmpresa,
                        valorParcela,
                        parcela,
                        quantidadeParcelas,
                        statusPagamento,
                        dataVencimento,
                        dataPagamento
                    ]
                );
            }

            for (const idPlaca of idsPlacas) {
                for (let mes = 5; mes >= 0; mes--) {
                    await connection.execute(
                        `
                            INSERT INTO monitoramentos (
                                id_placa,
                                energia_gerada,
                                eficiencia,
                                temperatura,
                                data_hora
                            )
                            VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? MONTH))
                        `,
                        [
                            idPlaca,
                            this.gerarValorAleatorio(35, 85),
                            this.gerarValorAleatorio(86, 99),
                            this.gerarValorAleatorio(28, 48),
                            mes
                        ]
                    );
                }
            }

            await connection.commit();

            return {
                id_empresa: idEmpresa,
                id_endereco: idEndereco,
                id_instalacao: idInstalacao,
                total_placas: idsPlacas.length,
                total_parcelas: quantidadeParcelas
            };

        } catch (error) {
            await connection.rollback();
            console.error('Erro ao preparar dados do cliente:', error);
            throw error;

        } finally {
            connection.release();
        }
    }

}

export default OrcamentoModel;