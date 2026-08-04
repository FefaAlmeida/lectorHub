import { hashPassword, comparePassword, getConnection } from '../config/database.js';

class UsuarioModel {

    static normalizarTipoUsuario(tipo) {
        const tipoNormalizado = String(tipo || 'CLIENTE').trim().toUpperCase();
        return tipoNormalizado === 'ADMIN' ? 'ADMIN' : 'CLIENTE';
    }

    // LISTAR USUÁRIOS (SEM SENHA)
    static async listarTodos(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const connection = await getConnection();

        try {
            const sql = `
                SELECT 
                    id_usuario AS id,
                    id_solicitacao,
                    nome,
                    email,
                    tipo_usuario,
                    status_usuario,
                    id_empresa
                FROM usuarios
                ORDER BY id_usuario DESC
                LIMIT ? OFFSET ?
            `;

            const [usuarios] = await connection.execute(sql, [limite, offset]);

            const [totalResult] = await connection.execute(
                'SELECT COUNT(*) as total FROM usuarios'
            );

            return {
                usuarios,
                total: totalResult[0].total,
                pagina,
                limite,
                totalPaginas: Math.ceil(totalResult[0].total / limite)
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
                    id_solicitacao,
                    nome,
                    email,
                    senha,
                    tipo_usuario,
                    status_usuario,
                    id_empresa
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

    // BUSCAR POR EMAIL (LOGIN)
    static async buscarPorEmail(email) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT 
                    id_usuario AS id,
                    id_solicitacao,
                    nome,
                    email,
                    senha,
                    tipo_usuario,
                    status_usuario,
                    id_empresa
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

    // CRIAR USUÁRIO (SÓ APÓS ACEITE DO ORÇAMENTO)
    static async criar(dados) {
        const connection = await getConnection();

        const senhaHash = await hashPassword(dados.senha);

        try {
            const sql = `
                INSERT INTO usuarios (
                    id_solicitacao,
                    nome,
                    email,
                    senha,
                    tipo_usuario,
                    status_usuario,
                    id_empresa
                )
                VALUES (?, ?, ?, ?, ?, 'ATIVO', ?)
            `;

            const [result] = await connection.execute(sql, [
                dados.id_solicitacao,
                dados.nome,
                dados.email,
                senhaHash,
                this.normalizarTipoUsuario(dados.tipo_usuario ?? dados.tipo),
                dados.id_empresa || null
            ]);

            return result.insertId;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR USUÁRIO
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

        if (dados.tipo_usuario !== undefined) {
            campos.push('tipo_usuario = ?');
            valores.push(this.normalizarTipoUsuario(dados.tipo_usuario));
        }

        if (dados.id_empresa !== undefined) {
            campos.push('id_empresa = ?');
            valores.push(dados.id_empresa);
        }

        if (dados.status_usuario !== undefined) {
            campos.push('status_usuario = ?');
            valores.push(dados.status_usuario);
        }

        if (campos.length === 0) return 0;

        const connection = await getConnection();

        try {
            const sql = `
                UPDATE usuarios
                SET ${campos.join(', ')}
                WHERE id_usuario = ?
            `;

            const [result] = await connection.execute(sql, [
                ...valores,
                id
            ]);

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // ATUALIZAR PRÓPRIO PERFIL (NOME E SENHA)
    static async atualizarPerfil(id, dados) {
        const campos = [];
        const valores = [];

        if (dados.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(dados.nome);
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

            const [result] = await connection.execute(sql, [
                ...valores,
                id
            ]);

            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // INATIVAR USUÁRIO (NÃO DELETA)
    static async inativar(id) {
        const connection = await getConnection();

        try {
            const sql = `
                UPDATE usuarios
                SET status_usuario = 'INATIVO'
                WHERE id_usuario = ?
            `;

            const [result] = await connection.execute(sql, [id]);
            return result.affectedRows;

        } finally {
            connection.release();
        }
    }

    // LOGIN
    static async verificarCredenciais(email, senha) {
        const usuario = await this.buscarPorEmail(email);
        if (!usuario) return null;

        if (usuario.status_usuario !== 'ATIVO') return null;

        const senhaOk = await comparePassword(senha, usuario.senha);
        if (!senhaOk) return null;

        delete usuario.senha;
        return usuario;
    }

}

export default UsuarioModel;