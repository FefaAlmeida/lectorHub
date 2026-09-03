import { hashPassword, comparePassword, getConnection } from '../config/database.js';

// Tabela `usuarios` (migration 20260804_003):
//   id_usuario INT PK AI | nome | email UNIQUE | senha | telefone NULL
//   tipo ENUM('admin', 'cliente') DEFAULT 'cliente'
//   banido TINYINT(1) DEFAULT 0 | banido_em DATETIME NULL | motivo_banimento NULL
// O alias `id_usuario AS id` é mantido porque controllers e JWT usam `usuario.id`.

class UsuarioModel {

    static normalizarTipo(tipo) {
        return String(tipo || 'cliente').trim().toLowerCase() === 'admin'
            ? 'admin'
            : 'cliente';
    }

    // Ordenações aceitas na listagem. O valor vem da query string, então nunca
    // é interpolado direto no SQL — só a expressão correspondente daqui.
    static ORDENS = {
        nome_asc: 'nome ASC',
        nome_desc: 'nome DESC',
        recentes: 'id_usuario DESC',
        antigos: 'id_usuario ASC'
    };

    // LISTAR USUÁRIOS (SEM SENHA)
    //
    // `busca`, `tipo` e `ordem` são resolvidos no banco, não na página já
    // carregada: filtrar no cliente só alcançaria os 10 registros da página
    // atual e deixaria o total da paginação contando quem foi filtrado.
    static async listarTodos(pagina = 1, limite = 10, filtros = {}) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL,
        // por isso são interpolados — sempre como inteiros sanitizados.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 10, 1), 100);
        const paginaSegura = Math.max(parseInt(pagina) || 1, 1);
        const offset = (paginaSegura - 1) * limiteSeguro;

        const condicoes = [];
        const valores = [];

        const busca = String(filtros.busca || '').trim();
        if (busca) {
            condicoes.push('(nome LIKE ? OR email LIKE ?)');
            valores.push(`%${busca}%`, `%${busca}%`);
        }

        if (filtros.tipo === 'admin' || filtros.tipo === 'cliente') {
            condicoes.push('tipo = ?');
            valores.push(filtros.tipo);
        }

        // 'ativos' | 'banidos'; qualquer outro valor não filtra.
        if (filtros.situacao === 'ativos') condicoes.push('banido = 0');
        if (filtros.situacao === 'banidos') condicoes.push('banido = 1');

        const onde = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
        const ordenacao = UsuarioModel.ORDENS[filtros.ordem] || UsuarioModel.ORDENS.nome_asc;

        const connection = await getConnection();

        try {
            const sql = `
                SELECT
                    id_usuario AS id,
                    nome,
                    email,
                    telefone,
                    tipo,
                    banido,
                    banido_em,
                    motivo_banimento
                FROM usuarios
                ${onde}
                ORDER BY ${ordenacao}
                LIMIT ${limiteSeguro} OFFSET ${offset}
            `;

            const [usuarios] = await connection.execute(sql, valores);

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM usuarios ${onde}`,
                valores
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

    // BANIR / REATIVAR
    //
    // Não apaga nada: `emprestimos.id_usuario` é FK para `usuarios`, então
    // excluir o leitor levaria junto o histórico de empréstimos. O banimento
    // só fecha o acesso — o cadastro e o histórico continuam de pé.
    static async definirBanimento(id, banido, motivo = null) {
        const connection = await getConnection();

        try {
            const [resultado] = await connection.execute(
                `UPDATE usuarios
                    SET banido = ?,
                        banido_em = ?,
                        motivo_banimento = ?
                  WHERE id_usuario = ?`,
                [banido ? 1 : 0, banido ? new Date() : null, banido ? motivo : null, id]
            );

            return resultado.affectedRows > 0;

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
                    tipo,
                    banido,
                    motivo_banimento
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
                    tipo,
                    banido,
                    motivo_banimento
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

    // ATUALIZAR PRÓPRIO PERFIL (NOME, E-MAIL, TELEFONE E SENHA)
    static async atualizarPerfil(id, dados) {
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