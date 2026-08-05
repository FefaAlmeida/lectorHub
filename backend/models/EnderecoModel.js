import { getConnection } from '../config/database.js';

class EnderecoModel {

    // LISTAR ENDEREÇOS POR EMPRESA
    static async listarPorEmpresa(id_empresa) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_endereco,
                    id_empresa,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado,
                    cep,
                    complemento
                FROM enderecos
                WHERE id_empresa = ?
                ORDER BY id_endereco DESC
            `;

            const [rows] = await connection.execute(sql, [id_empresa]);

            return rows;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR ID
    static async buscarPorId(id) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_endereco,
                    id_empresa,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado,
                    cep,
                    complemento
                FROM enderecos
                WHERE id_endereco = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [id]);

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // CRIAR ENDEREÇO
    static async criar(dados, conexaoTransacao = null) {

        const connection = conexaoTransacao || await getConnection();

        try {

            const sql = `
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute(sql, [
                dados.id_empresa,
                dados.logradouro,
                dados.numero || null,
                dados.bairro || null,
                dados.cidade,
                dados.estado,
                dados.cep || null,
                dados.complemento || null
            ]);

            return result.insertId;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }

    // ATUALIZAR ENDEREÇO
    static async atualizar(id, dados, conexaoTransacao = null) {

        const campos = [];
        const valores = [];

        if (dados.logradouro !== undefined) {
            campos.push('logradouro = ?');
            valores.push(dados.logradouro);
        }

        if (dados.numero !== undefined) {
            campos.push('numero = ?');
            valores.push(dados.numero);
        }

        if (dados.bairro !== undefined) {
            campos.push('bairro = ?');
            valores.push(dados.bairro);
        }

        if (dados.cidade !== undefined) {
            campos.push('cidade = ?');
            valores.push(dados.cidade);
        }

        if (dados.estado !== undefined) {
            campos.push('estado = ?');
            valores.push(dados.estado);
        }

        if (dados.cep !== undefined) {
            campos.push('cep = ?');
            valores.push(dados.cep);
        }

        if (dados.complemento !== undefined) {
            campos.push('complemento = ?');
            valores.push(dados.complemento);
        }

        if (campos.length === 0) {
            return 0;
        }

        const connection = conexaoTransacao || await getConnection();

        try {

            const sql = `
                UPDATE enderecos
                SET ${campos.join(', ')}
                WHERE id_endereco = ?
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

    // DELETAR ENDEREÇO
    static async deletar(id, conexaoTransacao = null) {

        const connection = conexaoTransacao || await getConnection();

        try {

            const sql = `
                DELETE FROM enderecos
                WHERE id_endereco = ?
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

export default EnderecoModel;