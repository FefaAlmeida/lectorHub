import { getConnection } from '../config/database.js';

// Tabela `emprestimos` (migration 20260804_004):
//   id_emprestimo INT PK AI | id_livro FK | id_usuario FK
//   data_solicitacao | data_emprestimo | data_devolucao_prevista | data_devolucao_real
//   status ENUM('PENDENTE','EMPRESTADO','DEVOLVIDO','RECUSADO','CANCELADO')

// --- REGRAS DE EMPRÉSTIMO ---
// Um pedido PENDENTE já reserva uma vaga: se ele for aprovado vira empréstimo,
// então contá-lo evita que o usuário abra 10 pedidos e estoure o limite.
export const STATUS_ATIVOS = ['PENDENTE', 'EMPRESTADO'];
export const LIMITE_EMPRESTIMOS = 2;
export const PRAZO_DIAS = 14;

const SELECT_COM_LIVRO = `
    SELECT
        e.id_emprestimo,
        e.id_livro,
        e.id_usuario,
        e.data_solicitacao,
        e.data_emprestimo,
        e.data_devolucao_prevista,
        e.data_devolucao_real,
        e.status,
        DATEDIFF(e.data_devolucao_prevista, NOW()) AS dias_restantes,
        l.titulo,
        l.autor,
        l.categoria,
        l.ano_publicacao,
        l.capa_url
    FROM emprestimos e
    INNER JOIN livros l ON e.id_livro = l.id_livro
`;

// `atrasado` só faz sentido para quem está com o livro na mão.
function normalizar(emprestimo) {
    if (!emprestimo) return null;

    const diasRestantes =
        emprestimo.dias_restantes === null
            ? null
            : Number(emprestimo.dias_restantes);

    return {
        ...emprestimo,
        dias_restantes: diasRestantes,
        atrasado:
            emprestimo.status === 'EMPRESTADO' &&
            diasRestantes !== null &&
            diasRestantes < 0
    };
}

class EmprestimoModel {

    // --- CONSULTAS DE REGRA ---

    // Quantos empréstimos ocupam vaga hoje (pendentes + em mãos)
    static async contarAtivos(idUsuario) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT COUNT(*) AS total
                FROM emprestimos
                WHERE id_usuario = ?
                  AND status IN ('PENDENTE', 'EMPRESTADO')
                `,
                [idUsuario]
            );

            return Number(rows[0].total);

        } finally {
            connection.release();
        }
    }

    // Empréstimos com prazo vencido e livro ainda não devolvido
    static async listarAtrasados(idUsuario) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                ${SELECT_COM_LIVRO}
                WHERE e.id_usuario = ?
                  AND e.status = 'EMPRESTADO'
                  AND e.data_devolucao_prevista < NOW()
                ORDER BY e.data_devolucao_prevista ASC
                `,
                [idUsuario]
            );

            return rows.map(normalizar);

        } finally {
            connection.release();
        }
    }

    // Impede pedir de novo um livro que o usuário já tem ou já solicitou
    static async possuiAtivoDoLivro(idUsuario, idLivro) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT id_emprestimo, status
                FROM emprestimos
                WHERE id_usuario = ?
                  AND id_livro = ?
                  AND status IN ('PENDENTE', 'EMPRESTADO')
                LIMIT 1
                `,
                [idUsuario, idLivro]
            );

            return rows[0] || null;

        } finally {
            connection.release();
        }
    }

    // --- LEITURA ---

    static async listarPorUsuario(idUsuario) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                ${SELECT_COM_LIVRO}
                WHERE e.id_usuario = ?
                ORDER BY e.data_solicitacao DESC
                `,
                [idUsuario]
            );

            return rows.map(normalizar);

        } finally {
            connection.release();
        }
    }

    static async buscarPorId(idEmprestimo) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `${SELECT_COM_LIVRO} WHERE e.id_emprestimo = ?`,
                [idEmprestimo]
            );

            return normalizar(rows[0]);

        } finally {
            connection.release();
        }
    }

    static async buscarUltimoPorUsuario(idUsuario) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                ${SELECT_COM_LIVRO}
                WHERE e.id_usuario = ?
                ORDER BY e.data_solicitacao DESC
                LIMIT 1
                `,
                [idUsuario]
            );

            return normalizar(rows[0]);

        } finally {
            connection.release();
        }
    }

    static async listarTodos({ status = '', pagina = 1, limite = 20 } = {}) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 20, 1), 100);
        const paginaSegura = Math.max(parseInt(pagina) || 1, 1);
        const offset = (paginaSegura - 1) * limiteSeguro;

        const filtros = [];
        const valores = [];

        if (status) {
            filtros.push('e.status = ?');
            valores.push(status);
        }

        const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                ${SELECT_COM_LIVRO}
                ${where}
                ORDER BY e.data_solicitacao DESC
                LIMIT ${limiteSeguro} OFFSET ${offset}
                `,
                valores
            );

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM emprestimos e ${where}`,
                valores
            );

            return {
                emprestimos: rows.map(normalizar),
                total: totalResult[0].total,
                pagina: paginaSegura,
                limite: limiteSeguro,
                totalPaginas: Math.ceil(totalResult[0].total / limiteSeguro)
            };

        } finally {
            connection.release();
        }
    }

    static async totalEmprestados() {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `SELECT COUNT(*) AS total FROM emprestimos WHERE status = 'EMPRESTADO'`
            );

            return Number(rows[0].total);

        } finally {
            connection.release();
        }
    }

    // --- ESCRITA ---

    static async criarSolicitacao(idUsuario, idLivro) {
        const connection = await getConnection();

        try {
            const [result] = await connection.execute(
                `
                INSERT INTO emprestimos (id_livro, id_usuario, status)
                VALUES (?, ?, 'PENDENTE')
                `,
                [idLivro, idUsuario]
            );

            return result.insertId;

        } finally {
            connection.release();
        }
    }

    // Aprovar marca a data de saída e o prazo; devolver registra a volta.
    static async atualizarStatus(idEmprestimo, status, prazoDias = PRAZO_DIAS) {
        const connection = await getConnection();

        try {
            let sql;

            if (status === 'EMPRESTADO') {
                sql = `
                    UPDATE emprestimos
                    SET status = 'EMPRESTADO',
                        data_emprestimo = NOW(),
                        data_devolucao_prevista = DATE_ADD(NOW(), INTERVAL ${Number(prazoDias) || PRAZO_DIAS} DAY),
                        data_devolucao_real = NULL
                    WHERE id_emprestimo = ?
                `;
            } else if (status === 'DEVOLVIDO') {
                sql = `
                    UPDATE emprestimos
                    SET status = 'DEVOLVIDO',
                        data_devolucao_real = NOW()
                    WHERE id_emprestimo = ?
                `;
            } else {
                sql = `
                    UPDATE emprestimos
                    SET status = ?
                    WHERE id_emprestimo = ?
                `;
            }

            const valores =
                status === 'EMPRESTADO' || status === 'DEVOLVIDO'
                    ? [idEmprestimo]
                    : [status, idEmprestimo];

            const [result] = await connection.execute(sql, valores);

            return result.affectedRows > 0;

        } finally {
            connection.release();
        }
    }
}

export default EmprestimoModel;
