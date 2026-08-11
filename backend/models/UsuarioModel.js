import { hashPassword, comparePassword, getConnection } from '../config/database.js';

// Tabela `usuarios` (migration 20260804_003):
//   id_usuario INT PK AI | nome | email UNIQUE | senha | telefone NULL
//   tipo ENUM('admin', 'cliente') DEFAULT 'cliente'
// O alias `id_usuario AS id` é mantido porque controllers e JWT usam `usuario.id`.

class UsuarioModel {

    static normalizarTipo(tipo) {
        return String(tipo || 'cliente').trim().toLowerCase() === 'admin'
            ? 'admin'
            : 'cliente';
    }

    // LISTAR USUÁRIOS (SEM SENHA)
    static async listarTodos(pagina = 1, limite = 10) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL,
        // por isso são interpolados — sempre como inteiros sanitizados.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 10, 1), 100);
        const paginaSegura = Math.max(parseInt(pagina) || 1, 1);
        const offset = (paginaSegura - 1) * limiteSeguro;

        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    id_usuario AS id,
                    nome,
                    email,
                    telefone,
                    tipo
                FROM usuarios
                ORDER BY id_usuario DESC
                LIMIT ${limiteSeguro} OFFSET ${offset}
            `;

            const [usuarios] = await connection.execute(sql);

            const [totalResult] = await connection.execute(
                'SELECT COUNT(*) AS total FROM usuarios'
            );

            return {
                usuarios,
                total: totalResult[0].total,
                pagina: paginaSegura,
                limite: limiteSeguro,
                totalPaginas: Math.ceil(totalResult[0].total / limiteSeguro)
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
                    id_usuario AS id,
                    nome,
                    email,
                    senha,
                    telefone,
                    tipo
                FROM usuarios
                WHERE id_usuario = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [id]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR EMAIL (LOGIN / CADASTRO)
    static async buscarPorEmail(email) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    id_usuario AS id,
                    nome,
                    email,
                    senha,
                    telefone,
                    tipo
                FROM usuarios
                WHERE email = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [email]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // CRIAR USUÁRIO (CADASTRO PÚBLICO)
    static async criar(dados) {
        const senhaHash = await hashPassword(dados.senha);
        const connection = await getConnection();

        try {
            const sql = `
                INSERT INTO usuarios (nome, email, senha, telefone, tipo)
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute(sql, [
                dados.nome,
                dados.email,
                senhaHash,
                dados.telefone || null,
                this.normalizarTipo(dados.tipo)
            ]);

            return result.insertId;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR USUÁRIO (ADMIN)
    static async atualizar(id, dados) {
        const campos = [];
        const valores = [];

        if (dados.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(dados.nome);
        }

        if (dados.email !== undefined) {
            campos.push('email = ?');
            valores.push(dados.email);
        }

        if (dados.senha !== undefined) {
            campos.push('senha = ?');
            valores.push(await hashPassword(dados.senha));
        }

        if (dados.telefone !== undefined) {
            campos.push('telefone = ?');
            valores.push(dados.telefone || null);
        }

        if (dados.tipo !== undefined) {
            campos.push('tipo = ?');
            valores.push(this.normalizarTipo(dados.tipo));
        }

        if (campos.length === 0) return 0;

        const connection = await getConnection();

        try {
            const sql = `
                UPDATE usuarios
                SET ${campos.join(', ')}
                WHERE id_usuario = ?
            `;

            const [result] = await connection.execute(sql, [...valores, id]);
            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR PRÓPRIO PERFIL (NOME, TELEFONE E SENHA)
    static async atualizarPerfil(id, dados) {
        const campos = [];
        const valores = [];

        if (dados.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(dados.nome);
        }

        if (dados.telefone !== undefined) {
            campos.push('telefone = ?');
            valores.push(dados.telefone || null);
        }

        if (dados.senha !== undefined) {
            campos.push('senha = ?');
            valores.push(await hashPassword(dados.senha));
        }

        if (campos.length === 0) return 0;

        const connection = await getConnection();

        try {
            const sql = `
                UPDATE usuarios
                SET ${campos.join(', ')}
                WHERE id_usuario = ?
            `;

            const [result] = await connection.execute(sql, [...valores, id]);
            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // LOGIN
    static async verificarCredenciais(email, senha) {
        const usuario = await this.buscarPorEmail(email);
        if (!usuario) return null;

        const senhaOk = await comparePassword(senha, usuario.senha);
        if (!senhaOk) return null;

        delete usuario.senha;
        return usuario;
    }

}

export default UsuarioModel;
