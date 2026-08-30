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
                    u.nome AS usuario_nome,
                    -- Quem já teve o livro em mãos ganha selo na tela.
                    -- Avaliar continua aberto a qualquer usuário; o selo só
                    -- diz ao leitor quais opiniões vêm de quem leu.
                    EXISTS (
                        SELECT 1 FROM emprestimos e
                        WHERE e.id_usuario = a.id_usuario
                          AND e.id_livro = a.id_livro
                          AND e.status IN ('EMPRESTADO', 'DEVOLVIDO')
                    ) AS leitor_verificado
                FROM avaliacoes a
                INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
                WHERE a.id_livro = ?
                -- Ordena pela data que a tela mostra. Era atualizado_em, e
                -- editar um comentário antigo o jogava para o topo exibindo a
                -- data de criação — parecia ordenação quebrada.
                ORDER BY a.criado_em DESC
                LIMIT ${limiteSeguro}
                `,
                [idLivro]
            );

            return rows.map((linha) => ({
                ...linha,
                leitor_verificado: Boolean(Number(linha.leitor_verificado)),
                // Marca edição para a tela poder dizer "editado" em vez de
                // mostrar só a data original.
                editado:
                    linha.atualizado_em && linha.criado_em
                        ? new Date(linha.atualizado_em).getTime() -
                              new Date(linha.criado_em).getTime() >
                          1000
                        : false
            }));

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
