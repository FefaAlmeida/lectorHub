import { getConnection } from '../config/database.js';

// Tabela `avaliacoes` (migration 20260804_007):
//   id_avaliacao INT PK AI | id_livro FK | id_usuario FK
//   nota TINYINT (1..5) | comentario TEXT NULL | criado_em | atualizado_em
// UNIQUE (id_livro, id_usuario): um usuário só tem uma avaliação por livro.

export const avaliacaoModel = {

    // LISTAR AVALIAÇÕES DE UM LIVRO (com o nome de quem avaliou)
    async listarPorLivro(idLivro, limite = 50) {
        // LIMIT não aceita placeholder em prepared statement no MySQL.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 50, 1), 100);

        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT
                    a.id_avaliacao AS id,
                    a.id_usuario,
                    a.nota,
                    a.comentario,
                    a.criado_em,
                    a.atualizado_em,
                    u.nome AS usuario_nome
                FROM avaliacoes a
                INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
                WHERE a.id_livro = ?
                ORDER BY a.atualizado_em DESC
                LIMIT ${limiteSeguro}
                `,
                [idLivro]
            );

            return rows;

        } finally {
            connection.release();
        }
    },

    // MÉDIA E DISTRIBUIÇÃO DE NOTAS
    async obterEstatisticas(idLivro) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT
                    COUNT(*) AS total_avaliacoes,
                    COALESCE(ROUND(AVG(nota), 1), 0) AS media_notas,
                    SUM(nota = 5) AS cinco_estrelas,
                    SUM(nota = 4) AS quatro_estrelas,
                    SUM(nota = 3) AS tres_estrelas,
                    SUM(nota = 2) AS duas_estrelas,
                    SUM(nota = 1) AS uma_estrela
                FROM avaliacoes
                WHERE id_livro = ?
                `,
                [idLivro]
            );

            const linha = rows[0];

            // MySQL devolve AVG/SUM como string decimal; o front espera número.
            return {
                total_avaliacoes: Number(linha.total_avaliacoes) || 0,
                media_notas: Number(linha.media_notas) || 0,
                cinco_estrelas: Number(linha.cinco_estrelas) || 0,
                quatro_estrelas: Number(linha.quatro_estrelas) || 0,
                tres_estrelas: Number(linha.tres_estrelas) || 0,
                duas_estrelas: Number(linha.duas_estrelas) || 0,
                uma_estrela: Number(linha.uma_estrela) || 0
            };

        } finally {
            connection.release();
        }
    },

    // AVALIAÇÃO DE UM USUÁRIO ESPECÍFICO NAQUELE LIVRO
    async buscarDoUsuario(idLivro, idUsuario) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT
                    id_avaliacao AS id,
                    id_usuario,
                    nota,
                    comentario,
                    criado_em,
                    atualizado_em
                FROM avaliacoes
                WHERE id_livro = ? AND id_usuario = ?
                `,
                [idLivro, idUsuario]
            );

            return rows[0] || null;

        } finally {
            connection.release();
        }
    },

    // CRIAR OU ATUALIZAR (a UNIQUE KEY decide qual dos dois acontece)
    async salvar(idLivro, idUsuario, nota, comentario) {
        const connection = await getConnection();

        try {
            await connection.execute(
                `
                INSERT INTO avaliacoes (id_livro, id_usuario, nota, comentario)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    nota = VALUES(nota),
                    comentario = VALUES(comentario)
                `,
                [idLivro, idUsuario, nota, comentario ?? null]
            );

        } finally {
            connection.release();
        }

        return this.buscarDoUsuario(idLivro, idUsuario);
    },

    // EXCLUIR A PRÓPRIA AVALIAÇÃO
    async excluir(idLivro, idUsuario) {
        const connection = await getConnection();

        try {
            const [result] = await connection.execute(
                'DELETE FROM avaliacoes WHERE id_livro = ? AND id_usuario = ?',
                [idLivro, idUsuario]
            );

            return result.affectedRows > 0;

        } finally {
            connection.release();
        }
    }
};
