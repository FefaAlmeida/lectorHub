import { getConnection } from '../config/database.js';

// Tabela `categorias` (migration 20260827_009):
//   id_categoria INT PK AI | nome VARCHAR(50) UNIQUE | descricao NULL | criado_em
// `livros.categoria_id` referencia esta tabela com ON DELETE RESTRICT
// (migration 20260827_010), então uma categoria em uso não pode ser apagada.

const COLUNAS = 'id_categoria AS id, nome, descricao';

async function consultar(sql, valores = []) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(sql, valores);
        return rows;
    } finally {
        connection.release();
    }
}

async function executar(sql, valores = []) {
    const connection = await getConnection();
    try {
        const [result] = await connection.execute(sql, valores);
        return result;
    } finally {
        connection.release();
    }
}

export const categoriaModel = {

    // `comLivros = true` traz a contagem — o admin precisa saber o que está em uso.
    async listar({ comLivros = false } = {}) {
        const sql = comLivros
            ? `SELECT c.id_categoria AS id, c.nome, c.descricao,
                      COUNT(l.id_livro) AS total_livros
               FROM categorias c
               LEFT JOIN livros l ON l.categoria_id = c.id_categoria
               GROUP BY c.id_categoria, c.nome, c.descricao
               ORDER BY c.nome ASC`
            : `SELECT ${COLUNAS} FROM categorias ORDER BY nome ASC`;

        const rows = await consultar(sql);

        return rows.map((linha) => ({
            ...linha,
            ...(comLivros ? { total_livros: Number(linha.total_livros) } : {})
        }));
    },

    // Só as que têm pelo menos um livro — alimenta o filtro da busca do cliente,
    // onde oferecer categoria vazia só gera resultado zerado.
    async listarComLivros() {
        const rows = await consultar(
            `SELECT c.id_categoria AS id, c.nome, COUNT(l.id_livro) AS total_livros
             FROM categorias c
             INNER JOIN livros l ON l.categoria_id = c.id_categoria
             GROUP BY c.id_categoria, c.nome
             ORDER BY c.nome ASC`
        );
        return rows.map((linha) => ({ ...linha, total_livros: Number(linha.total_livros) }));
    },

    async buscarPorId(id) {
        const rows = await consultar(`SELECT ${COLUNAS} FROM categorias WHERE id_categoria = ?`, [id]);
        return rows[0] || null;
    },

    async buscarPorNome(nome) {
        const rows = await consultar(`SELECT ${COLUNAS} FROM categorias WHERE nome = ?`, [nome]);
        return rows[0] || null;
    },

    async contarLivros(id) {
        const rows = await consultar(
            'SELECT COUNT(*) AS total FROM livros WHERE categoria_id = ?',
            [id]
        );
        return Number(rows[0].total);
    },

    async criar({ nome, descricao = null }) {
        const result = await executar(
            'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
            [nome, descricao]
        );
        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, { nome, descricao }) {
        const campos = [];
        const valores = [];

        if (nome !== undefined) {
            campos.push('nome = ?');
            valores.push(nome);
        }

        if (descricao !== undefined) {
            campos.push('descricao = ?');
            valores.push(descricao);
        }

        if (campos.length === 0) return this.buscarPorId(id);

        const result = await executar(
            `UPDATE categorias SET ${campos.join(', ')} WHERE id_categoria = ?`,
            [...valores, id]
        );

        return result.affectedRows === 0 ? null : this.buscarPorId(id);
    },

    async excluir(id) {
        const result = await executar('DELETE FROM categorias WHERE id_categoria = ?', [id]);
        return result.affectedRows > 0;
    }
};
