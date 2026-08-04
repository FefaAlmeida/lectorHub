import { getConnection } from '../config/database.js';

class InstalacaoModel {

    // LISTAR TODAS AS INSTALAÇÕES (PAGINADO - VISÃO ADMIN COM ENDEREÇO)
    static async listarTodas(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    i.id_instalacao,
                    i.id_empresa,
                    emp.nome_empresa AS nome_empresa,
                    i.id_tecnico AS tecnico,
                    tec.nome AS nome_tecnico,
                    i.id_endereco,
                    i.data_instalacao AS dataVisita,
                    i.status_instalacao AS status,
                    e.logradouro,
                    e.numero,
                    e.bairro,
                    e.cidade,
                    e.estado,
                    e.cep
                FROM instalacoes i
                LEFT JOIN enderecos e ON i.id_endereco = e.id_endereco
                LEFT JOIN empresa_clientes emp ON i.id_empresa = emp.id_empresa
                LEFT JOIN tecnicos tec ON i.id_tecnico = tec.id_tecnico
                ORDER BY i.id_instalacao DESC
                LIMIT ? OFFSET ?
            `;

            // Garante o casting para número inteiro no driver do MySQL
            const [instalacoes] = await connection.execute(sql, [Number(limite), Number(offset)]);

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM instalacoes`
            );

            return {
                instalacoes,
                total: totalResult[0].total,
                pagina,
                limite,
                totalPaginas: Math.ceil(totalResult[0].total / limite)
            };

        } catch (error) {
            console.error("Erro na query listarTodas:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // LISTAR INSTALAÇÕES POR EMPRESA (VISÃO CLIENTE)
    static async listarPorEmpresa(id_empresa) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    i.id_instalacao,
                    i.id_empresa,
                    i.id_tecnico AS tecnico,
                    i.id_endereco,
                    i.data_instalacao AS dataVisita,
                    i.status_instalacao AS status,
                    e.logradouro,
                    e.numero,
                    e.bairro,
                    e.cidade,
                    e.estado,
                    e.cep
                FROM instalacoes i
                LEFT JOIN enderecos e ON i.id_endereco = e.id_endereco
                WHERE i.id_empresa = ?
                ORDER BY i.id_instalacao DESC
            `;

            const [rows] = await connection.execute(sql, [id_empresa]);
            return rows;

        } catch (error) {
            console.error("Erro na query listarPorEmpresa:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // BUSCAR POR ID (CLIENTE OU ADMIN)
    static async buscarPorId(id) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    i.id_instalacao,
                    i.id_empresa,
                    emp.nome_empresa AS nome_empresa,
                    i.id_tecnico AS tecnico,
                    tec.nome AS nome_tecnico,
                    i.id_endereco,
                    i.data_instalacao AS dataVisita,
                    i.status_instalacao AS status,
                    e.logradouro,
                    e.numero,
                    e.bairro,
                    e.cidade,
                    e.estado,
                    e.cep
                FROM instalacoes i
                LEFT JOIN enderecos e ON i.id_endereco = e.id_endereco
                LEFT JOIN empresa_clientes emp ON i.id_empresa = emp.id_empresa
                LEFT JOIN tecnicos tec ON i.id_tecnico = tec.id_tecnico
                WHERE i.id_instalacao = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [id]);
            return rows[0] || null;

        } catch (error) {
            console.error("Erro na query buscarPorId:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // CRIAR INSTALAÇÃO
    static async criar(dados, conexaoTransacao = null) {
        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                INSERT INTO instalacoes (
                    id_empresa,
                    id_endereco,
                    id_tecnico,
                    data_instalacao,
                    status_instalacao
                )
                VALUES (?, ?, ?, ?, 'PENDENTE')
            `;

            const [result] = await connection.execute(sql, [
                dados.id_empresa,
                dados.id_endereco,
                dados.id_tecnico || null,
                dados.data_instalacao || null
            ]);

            return result.insertId;

        } catch (error) {
            console.error("Erro na query criar instalacao:", error);
            throw error;
        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }


    // ATUALIZAR INSTALAÇÃO (BLINDADO CONTRA ERRO 500)
    static async atualizar(id, dados, conexaoTransacao = null) {
        const campos = [];
        const valores = [];

        // 1. Mapeia o campo do Técnico (Trata 'tecnico' ou 'id_tecnico')
        const tecnicoValue = dados.tecnico !== undefined ? dados.tecnico : dados.id_tecnico;
        if (tecnicoValue !== undefined) {
            campos.push('id_tecnico = ?');
            valores.push(tecnicoValue);
        }

        // 2. Mapeia a Data da Visita (Trata 'dataVisita' ou 'data_instalacao')
        const dataValue = dados.dataVisita !== undefined ? dados.dataVisita : dados.data_instalacao;
        if (dataValue !== undefined) {
            campos.push('data_instalacao = ?');
            valores.push(dataValue);
        }

        // 3. Mapeia o Status (Trata 'status' ou 'status_instalacao')
        const statusValue = dados.status !== undefined ? dados.status : dados.status_instalacao;
        if (statusValue !== undefined) {
            campos.push('status_instalacao = ?');
            valores.push(statusValue);
        }

        // Se nenhum campo válido foi mapeado, evita enviar uma query quebrada ao banco
        if (campos.length === 0) {
            return 0;
        }

        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                UPDATE instalacoes
                SET ${campos.join(', ')}
                WHERE id_instalacao = ?
            `;

            const [result] = await connection.execute(
                sql,
                [...valores, id]
            );

            return result.affectedRows;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }

    // CANCELAR INSTALAÇÃO
    static async cancelar(id, conexaoTransacao = null) {
        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                UPDATE instalacoes
                SET status_instalacao = 'CANCELADA'
                WHERE id_instalacao = ?
            `;

            const [result] = await connection.execute(sql, [id]);
            return result.affectedRows;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }
}

export default InstalacaoModel;