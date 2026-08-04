import { getConnection } from '../config/database.js';

class TecnicoModel {

    // LISTAR TODOS OS TÉCNICOS (PAGINADO)
    static async listarTodos(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const connection = await getConnection();

        try {
            const sql = `
                SELECT 
                    id_tecnico,
                    nome,
                    telefone,
                    email,
                    status_tecnico AS status
                FROM tecnicos
                ORDER BY nome ASC
                LIMIT ? OFFSET ?
            `;

            const [tecnicos] = await connection.execute(sql, [limite, offset]);

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM tecnicos`
            );

            return {
                tecnicos,
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
                    id_tecnico,
                    nome,
                    telefone,
                    email,
                    status_tecnico AS status
                FROM tecnicos
                WHERE id_tecnico = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [id]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR EMAIL
    static async buscarPorEmail(email) {
        const connection = await getConnection();

        try {
            const sql = `SELECT id_tecnico, email FROM tecnicos WHERE email = ? LIMIT 1`;
            const [rows] = await connection.execute(sql, [email]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // BUSCAR POR TELEFONE
    static async buscarPorTelefone(telefone) {
        const connection = await getConnection();

        try {
            const sql = `SELECT id_tecnico, telefone FROM tecnicos WHERE telefone = ? LIMIT 1`;
            const [rows] = await connection.execute(sql, [telefone]);
            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // CRIAR TÉCNICO
    static async criar(dados, conexaoTransacao = null) {
        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                INSERT INTO tecnicos (
                    nome,
                    telefone,
                    email,
                    status_tecnico
                ) VALUES (?, ?, ?, 'ATIVO')
            `;

            const [result] = await connection.execute(sql, [
                dados.nome.trim(),
                dados.telefone.trim(),
                dados.email.trim().toLowerCase()
            ]);

            return result.insertId;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }

    // ATUALIZAR TÉCNICO 
    static async atualizar(id, dados, conexaoTransacao = null) {
        const campos = [];
        const valores = [];

        if (dados.nome !== undefined) {
            campos.push('nome = ?');
            valores.push(dados.nome.trim());
        }

        if (dados.telefone !== undefined) {
            campos.push('telefone = ?');
            valores.push(dados.telefone.trim());
        }

        if (dados.email !== undefined) {
            campos.push('email = ?');
            valores.push(dados.email.trim().toLowerCase());
        }

        // Trata 'status' vindo do front ou 'status_tecnico' direto
        const statusValue = dados.status !== undefined ? dados.status : dados.status_tecnico;
        if (statusValue !== undefined) {
            campos.push('status_tecnico = ?');
            valores.push(statusValue);
        }

        if (campos.length === 0) {
            return 0;
        }

        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                UPDATE tecnicos
                SET ${campos.join(', ')}
                WHERE id_tecnico = ?
            `;

            const [result] = await connection.execute(sql, [...valores, id]);
            return result.affectedRows;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }

    // DESATIVAR TÉCNICO (EXCLUSÃO LÓGICA)
    static async desativar(id, conexaoTransacao = null) {
        const connection = conexaoTransacao || await getConnection();

        try {
            const sql = `
                UPDATE tecnicos
                SET status_tecnico = 'INATIVO'
                WHERE id_tecnico = ?
            `;

            const [result] = await connection.execute(sql, [id]);
            return result.affectedRows;

        } finally {
            if (!conexaoTransacao) {
                connection.release();
            }
        }
    }

    static async listarAtivos() {
        const connection = await getConnection();
        try {
            const sql = `SELECT id_tecnico, nome FROM tecnicos WHERE status_tecnico = 'ATIVO' ORDER BY nome ASC`;
            const [rows] = await connection.execute(sql);
            return rows;
        } finally {
            connection.release();
        }
    }

}


export default TecnicoModel;