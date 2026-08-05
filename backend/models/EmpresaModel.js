import { getConnection } from '../config/database.js';

class EmpresaModel {

    // LISTAR EMPRESAS
    static async listarTodas(pagina = 1, limite = 10) {

        const offset = (pagina - 1) * limite;
        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                FROM empresa_clientes
                ORDER BY id_empresa DESC
                LIMIT ? OFFSET ?
            `;

            const [empresas] = await connection.execute(
                sql,
                [limite, offset]
            );

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM empresa_clientes`
            );

            return {
                empresas,
                total: totalResult[0].total,
                pagina,
                limite,
                totalPaginas: Math.ceil(
                    totalResult[0].total / limite
                )
            };

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
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                FROM empresa_clientes
                WHERE id_empresa = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [id]);

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR CNPJ
    static async buscarPorCnpj(cnpj) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                FROM empresa_clientes
                WHERE cnpj = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [cnpj]);

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR TELEFONE
    static async buscarPorTelefone(telefone) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                FROM empresa_clientes
                WHERE telefone_principal = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [telefone]);

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR NOME
    static async buscarPorNome(nome) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                FROM empresa_clientes
                WHERE nome_empresa LIKE ?
                ORDER BY nome_empresa
            `;

            const [rows] = await connection.execute(
                sql,
                [`%${nome}%`]
            );

            return rows;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR E-MAIL
    static async buscarPorEmail(email) {

        const connection = await getConnection();

        try {

            const sql = `
                SELECT
                    id_empresa,
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
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

    // CRIAR EMPRESA
    static async criar(dados) {

        const connection = await getConnection();

        try {

            const sql = `
                INSERT INTO empresa_clientes (
                    nome_empresa,
                    cnpj,
                    telefone_principal,
                    email_principal,
                    status_empresa
                )
                VALUES (?, ?, ?, ?, 'ATIVA')
            `;

            const [result] = await connection.execute(sql, [
                dados.nome_empresa,
                dados.cnpj,
                dados.telefone_principal,
                dados.email_principal
            ]);

            return result.insertId;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR EMPRESA
    static async atualizar(id, dados) {

        const campos = [];
        const valores = [];

        if (dados.nome_empresa !== undefined) {
            campos.push('nome_empresa = ?');
            valores.push(dados.nome_empresa);
        }

        if (dados.cnpj !== undefined) {
            campos.push('cnpj = ?');
            valores.push(dados.cnpj);
        }

        if (dados.telefone_principal !== undefined) {
            campos.push('telefone_principal = ?');
            valores.push(dados.telefone_principal);
        }

        if (dados.email_principal !== undefined) {
            campos.push('email_principal = ?');
            valores.push(dados.email_principal);
        }

        if (dados.status_empresa !== undefined) {
            campos.push('status_empresa = ?');
            valores.push(dados.status_empresa);
        }

        if (campos.length === 0) {
            return 0;
        }

        const connection = await getConnection();

        try {

            const sql = `
                UPDATE empresa_clientes
                SET ${campos.join(', ')}
                WHERE id_empresa = ?
            `;

            const [result] = await connection.execute(
                sql,
                [...valores, id]
            );

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR DADOS EDITÁVEIS DA EMPRESA
    static async atualizarDadosEditaveis(id, dados) {

        const campos = [];
        const valores = [];

        if (dados.nome_empresa !== undefined) {
            campos.push('nome_empresa = ?');
            valores.push(dados.nome_empresa);
        }

        if (dados.telefone_principal !== undefined) {
            campos.push('telefone_principal = ?');
            valores.push(dados.telefone_principal);
        }

        if (campos.length === 0) {
            return 0;
        }

        const connection = await getConnection();

        try {

            const sql = `
                UPDATE empresa_clientes
                SET ${campos.join(', ')}
                WHERE id_empresa = ?
            `;

            const [result] = await connection.execute(
                sql,
                [...valores, id]
            );

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // INATIVAR EMPRESA
    static async inativar(id) {

        const connection = await getConnection();

        try {

            const sql = `
                UPDATE empresa_clientes
                SET status_empresa = 'INATIVA'
                WHERE id_empresa = ?
            `;

            const [result] = await connection.execute(sql, [id]);

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // REATIVAR EMPRESA
    static async reativar(id) {

        const connection = await getConnection();

        try {

            const sql = `
                UPDATE empresa_clientes
                SET status_empresa = 'ATIVA'
                WHERE id_empresa = ?
            `;

            const [result] = await connection.execute(sql, [id]);

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

}

export default EmpresaModel;