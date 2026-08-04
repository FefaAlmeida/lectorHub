import { getConnection } from '../config/database.js';

class DashboardModel {

    static gerarValorAleatorio(min, max) {
        return Number((Math.random() * (max - min) + min).toFixed(2));
    }

    static async registrarAlertaDinamico(connection, idMonitoramento, tipo, descricao, nivel) {
        // Evita duplicar alertas idênticos ATIVOS para o mesmo monitoramento/placa
        const [existente] = await connection.execute(
            `SELECT id_alerta FROM alertas 
            WHERE id_monitoramento = ? AND tipo_alerta = ? AND status_alerta = 'ATIVO' LIMIT 1`,
            [idMonitoramento, tipo]
        );

        if (existente.length === 0) {
            await connection.execute(
                `INSERT INTO alertas (id_monitoramento, tipo_alerta, descricao, nivel, status_alerta)
                VALUES (?, ?, ?, ?, 'ATIVO')`,
                [idMonitoramento, tipo, descricao, nivel]
            );
        }
    }

    static async buscarEmpresaDoUsuario(idUsuario) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT id_empresa
                FROM usuarios
                WHERE id_usuario = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [idUsuario]);
            return rows[0]?.id_empresa || null;

        } finally {
            connection.release();
        }
    }

    static async gerarLeiturasSimuladas(idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return 0;
        }

        const connection = await getConnection();

        try {
            const [placas] = await connection.execute(
                `
                    SELECT id_placa, potencia_watts, modelo
                    FROM placas_solares
                    WHERE id_empresa = ?
                    AND status_placa = 'ATIVA'
                `,
                [idEmpresa]
            );

            for (const placa of placas) {
                const potenciaKw = Number(placa.potencia_watts || 0) / 1000;
                const eficiencia = this.gerarValorAleatorio(82, 99);
                const temperatura = this.gerarValorAleatorio(28, 52);
                const fatorGeracao = this.gerarValorAleatorio(3.5, 6.5);
                const energiaGerada = Number((potenciaKw * fatorGeracao * (eficiencia / 100)).toFixed(2));

                const [result] = await connection.execute(
                    `
                        INSERT INTO monitoramentos (
                            id_placa,
                            energia_gerada,
                            eficiencia,
                            temperatura,
                            data_hora
                        )
                        VALUES (?, ?, ?, ?, NOW())
                    `,
                    [placa.id_placa, energiaGerada, eficiencia, temperatura]
                );

                const idMonitoramento = result.insertId;

                // 🚨 GERAÇÃO DINÂMICA DE ALERTAS COM BASE NAS LEITURAS SIMULADAS
                if (eficiencia < 85) {
                    await this.registrarAlertaDinamico(
                        connection, 
                        idMonitoramento, 
                        'QUEDA_EFICIENCIA', 
                        `Eficiência abaixo do limite operacional: ${eficiencia}%`, 
                        'MEDIO'
                    );
                }

                if (temperatura > 50) {
                    await this.registrarAlertaDinamico(
                        connection, 
                        idMonitoramento, 
                        'TEMPERATURA_ALTA', 
                        `Temperatura crítica detectada no painel: ${temperatura}°C`, 
                        'ALTO'
                    );
                }
            }

            return placas.length;

        } finally {
            connection.release();
        }
    }

    static async buscarAlertas(idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return [];
        }

        const connection = await getConnection();

        try {
            // Agora busca diretamente da tabela de alertas populada dinamicamente
            const sql = `
                SELECT
                    p.id_placa,
                    p.modelo,
                    p.status_placa,
                    a.tipo_alerta,
                    a.descricao,
                    a.nivel,
                    a.data_alerta AS data_hora
                FROM alertas a
                INNER JOIN monitoramentos m ON a.id_monitoramento = m.id_monitoramento
                INNER JOIN placas_solares p ON m.id_placa = p.id_placa
                WHERE p.id_empresa = ? AND a.status_alerta = 'ATIVO'
                ORDER BY a.data_alerta DESC
                LIMIT 10
            `;

            const [rows] = await connection.execute(sql, [idEmpresa]);
            return rows;

        } finally {
            connection.release();
        }
    }

    static async buscarResumo(idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return {
                energiaGeradaMes: 0,
                consumoMensal: 0,
                economiaGerada: 0,
                economiaMensal: 0,
                eficienciaMedia: 0,
                totalAlertas: 0,
                statusOperacional: 'Sem instalação'
            };
        }

        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    COALESCE(SUM(
                        CASE
                            WHEN MONTH(m.data_hora) = MONTH(CURRENT_DATE())
                             AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
                            THEN m.energia_gerada
                            ELSE 0
                        END
                    ), 0) AS energiaGeradaMes,
                    COALESCE(AVG(m.eficiencia), 0) AS eficienciaMedia,
                    COALESCE(SUM(m.energia_gerada), 0) AS energiaGeradaTotal,
                    SUM(
                        CASE
                            WHEN p.status_placa <> 'ATIVA' OR m.eficiencia < 80
                            THEN 1
                            ELSE 0
                        END
                    ) AS totalAlertas
                FROM placas_solares p
                LEFT JOIN monitoramentos m ON m.id_placa = p.id_placa
                WHERE p.id_empresa = ?
            `;

            const [rows] = await connection.execute(sql, [idEmpresa]);
            const resumo = rows[0] || {};
            const energiaGeradaMes = Number(resumo.energiaGeradaMes || 0);
            const eficienciaMedia = Number(resumo.eficienciaMedia || 0);
            const totalAlertas = Number(resumo.totalAlertas || 0);
            const economiaMensal = Math.round(energiaGeradaMes * 0.72);

            return {
                energiaGeradaMes,
                consumoMensal: Math.round(energiaGeradaMes * 0.6),
                economiaGerada: Math.round(Number(resumo.energiaGeradaTotal || 0) * 0.72),
                economiaMensal,
                eficienciaMedia: Math.round(eficienciaMedia),
                totalAlertas,
                statusOperacional: totalAlertas > 0 ? 'Atenção' : 'Tudo em dia'
            };

        } finally {
            connection.release();
        }
    }

    static async buscarGraficoMonitoramento(idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return [];
        }

        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    DATE_FORMAT(m.data_hora, '%m/%Y') AS mes,
                    COALESCE(SUM(m.energia_gerada), 0) AS energiaGerada
                FROM monitoramentos m
                INNER JOIN placas_solares p ON p.id_placa = m.id_placa
                WHERE p.id_empresa = ?
                  AND m.data_hora >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
                GROUP BY YEAR(m.data_hora), MONTH(m.data_hora)
                ORDER BY YEAR(m.data_hora), MONTH(m.data_hora)
            `;

            const [rows] = await connection.execute(sql, [idEmpresa]);

            return rows.map((row) => ({
                mes: row.mes,
                energiaGerada: Number(row.energiaGerada || 0)
            }));

        } finally {
            connection.release();
        }
    }

    static async buscarFinanceiro(idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return {
                idPagamento: null,
                parcelasPagas: 0,
                totalParcelas: 0,
                parcelasRestantes: 0,
                valorPago: 0,
                valorRestante: 0,
                statusPagamento: 'Sem pagamentos',
                formaPagamento: '-',
                ultimoPagamento: null,
                proximoVencimento: null,
                valorParcela: 0
            };
        }

        const connection = await getConnection();

        try {
            const sqlResumo = `
                SELECT
                    COALESCE(MAX(quantidade_parcelas), 0) AS totalParcelas,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN 1 ELSE 0 END), 0) AS parcelasPagas,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN valor ELSE 0 END), 0) AS valorPago,
                    COALESCE(SUM(CASE WHEN status_pagamento <> 'PAGO' THEN valor ELSE 0 END), 0) AS valorRestante,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'ATRASADO' THEN 1 ELSE 0 END), 0) AS atrasadas
                FROM pagamentos
                WHERE id_empresa = ?
            `;

            const sqlProxima = `
                SELECT id_pagamento, valor, forma_pagamento, data_vencimento
                FROM pagamentos
                WHERE id_empresa = ?
                  AND status_pagamento <> 'PAGO'
                ORDER BY data_vencimento ASC
                LIMIT 1
            `;

            const sqlUltimo = `
                SELECT data_pagamento, forma_pagamento
                FROM pagamentos
                WHERE id_empresa = ?
                  AND status_pagamento = 'PAGO'
                ORDER BY data_pagamento DESC
                LIMIT 1
            `;

            const [resumoRows] = await connection.execute(sqlResumo, [idEmpresa]);
            const [proximaRows] = await connection.execute(sqlProxima, [idEmpresa]);
            const [ultimoRows] = await connection.execute(sqlUltimo, [idEmpresa]);

            const resumo = resumoRows[0] || {};
            const proxima = proximaRows[0] || {};
            const ultimo = ultimoRows[0] || {};
            const totalParcelas = Number(resumo.totalParcelas || 0);
            const parcelasPagas = Number(resumo.parcelasPagas || 0);
            const atrasadas = Number(resumo.atrasadas || 0);

            return {
                idPagamento: proxima.id_pagamento || null,
                parcelasPagas,
                totalParcelas,
                parcelasRestantes: Math.max(totalParcelas - parcelasPagas, 0),
                valorPago: Number(resumo.valorPago || 0),
                valorRestante: Number(resumo.valorRestante || 0),
                statusPagamento: atrasadas > 0 ? 'Atrasado' : 'Em dia',
                formaPagamento: proxima.forma_pagamento || ultimo.forma_pagamento || '-',
                ultimoPagamento: ultimo.data_pagamento || null,
                proximoVencimento: proxima.data_vencimento || null,
                valorParcela: Number(proxima.valor || 0)
            };

        } finally {
            connection.release();
        }
    }

    static async buscarHistoricoFinanceiro(idUsuario, limite = 4) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return [];
        }

        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    numero_parcela,
                    status_pagamento,
                    forma_pagamento,
                    valor,
                    data_vencimento,
                    data_pagamento
                FROM pagamentos
                WHERE id_empresa = ?
                ORDER BY COALESCE(data_pagamento, data_vencimento) DESC
                LIMIT ?
            `;

            const [rows] = await connection.execute(sql, [idEmpresa, limite]);
            return rows;

        } finally {
            connection.release();
        }
    }



    static async buscarDadosGeraisDoCliente(idUsuario) {
        const connection = await getConnection(); 
        try {

            await this.gerarLeiturasSimuladas(idUsuario);

            // 1. Busca o id_empresa vinculado ao usuário
            const [usuario] = await connection.execute(
                `SELECT id_empresa FROM usuarios WHERE id_usuario = ? LIMIT 1`,
                [idUsuario]
            );

            if (!usuario.length || !usuario[0].id_empresa) {
                return { instalado: false, mensagem: "Nenhuma empresa vinculada." };
            }

            const idEmpresa = usuario[0].id_empresa;

            // 2. Verifica se a instalação já foi finalizada
            const [instalacao] = await connection.execute(
                `SELECT status_instalacao FROM instalacoes WHERE id_empresa = ? AND status_instalacao = 'FINALIZADA' LIMIT 1`,
                [idEmpresa]
            );

            if (instalacao.length === 0) {
                return { instalado: false, mensagem: "Seu sistema ainda não foi instalado." };
            }

            // 3. CORREÇÃO DEFINITIVA: Busca o total real de placas cadastradas para a empresa
            const [placasTotaisBanco] = await connection.execute(
                `SELECT COUNT(*) as total FROM placas_solares 
                 WHERE id_empresa = ?`,
                [idEmpresa]
            );

            // Busca a contagem real de placas que estão com status 'ATIVA'
            const [placasAtivasBanco] = await connection.execute(
                `SELECT COUNT(*) as ativas FROM placas_solares 
                 WHERE id_empresa = ? AND status_placa = 'ATIVA'`,
                [idEmpresa]
            );

            const dadosPlacas = {
                total: placasTotaisBanco[0]?.total || 0,
                ativas: placasAtivasBanco[0]?.ativas || 0
            };

            // 4. Busca dados acumulados do monitoramento das placas da empresa
            const [monitoramento] = await connection.execute(
                `SELECT 
                    IFNULL(SUM(m.energia_gerada), 0) as energia_total,
                    IFNULL(AVG(m.eficiencia), 0) as eficiencia_media
                 FROM monitoramentos m
                 JOIN placas_solares p ON m.id_placa = p.id_placa
                 WHERE p.id_empresa = ?`,
                [idEmpresa]
            );

            // 5. Busca se existem alertas ativos de nível ALTO ou CRÍTICO
            const [alertas] = await connection.execute(
                `SELECT COUNT(*) as ativos FROM alertas a
                 JOIN monitoramentos m ON a.id_monitoramento = m.id_monitoramento
                 JOIN placas_solares p ON m.id_placa = p.id_placa
                 WHERE p.id_empresa = ? AND a.status_alerta = 'ATIVO' AND a.nivel IN ('ALTO', 'CRITICO')`,
                [idEmpresa]
            );

            const dadosMonit = monitoramento[0] || { energia_total: 0, eficiencia_media: 0 };
            const totalAlertas = alertas[0]?.ativos || 0;

            // Cálculos de Negócio
            const valorKwh = 0.85; 
            const economyTotal = dadosMonit.energia_total * valorKwh;
            const economiaMensal = (dadosMonit.energia_total / 12) * valorKwh; 
            const co2EvitadoToneladas = ((dadosMonit.energia_total * 0.42) / 1000).toFixed(2);

            return {
                instalado: true,
                dados: {
                    eficienciaSistema: parseFloat(dadosMonit.eficiencia_media).toFixed(1),
                    placasTotais: dadosPlacas.total, 
                    placasAtivas: dadosPlacas.ativas,
                    energiaTotalGerada: parseFloat(dadosMonit.energia_total).toFixed(1),
                    economiaTotal: economyTotal.toFixed(2),
                    economiaMensal: economiaMensal.toFixed(2),
                    alertasCriticos: totalAlertas,
                    co2Evitado: co2EvitadoToneladas
                }
            };

        } finally {
            connection.release(); 
        }
    }

}

export default DashboardModel;
