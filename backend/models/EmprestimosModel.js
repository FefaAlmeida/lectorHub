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

// Atraso é contado por DIA (não por hora): no dia do vencimento ainda não
// está atrasado; no dia seguinte, está. DATEDIFF e CURDATE() usam a mesma régua.
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
        DATEDIFF(DATE(e.data_devolucao_prevista), CURDATE()) AS dias_restantes,
        l.titulo,
        l.autor,
        l.categoria_id,
        cat.nome AS categoria,
        l.ano_publicacao,
        l.capa_url,
        u.nome AS usuario_nome,
        u.email AS usuario_email,
        u.telefone AS usuario_telefone
    FROM emprestimos e
    INNER JOIN livros l ON e.id_livro = l.id_livro
    INNER JOIN categorias cat ON cat.id_categoria = l.categoria_id
    INNER JOIN usuarios u ON e.id_usuario = u.id_usuario
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

async function consultar(sql, valores = []) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(sql, valores);
        return rows;
    } finally {
        connection.release();
    }
}

class EmprestimoModel {

    // --- CONSULTAS DE REGRA ---

    // Quantos empréstimos ocupam vaga hoje (pendentes + em mãos)
    static async contarAtivos(idUsuario) {
        const rows = await consultar(
            `SELECT COUNT(*) AS total FROM emprestimos
             WHERE id_usuario = ? AND status IN ('PENDENTE', 'EMPRESTADO')`,
            [idUsuario]
        );
        return Number(rows[0].total);
    }

    // Quantos pedidos/empréstimos ativos um LIVRO tem (bloqueia exclusão)
    static async contarAtivosDoLivro(idLivro) {
        const rows = await consultar(
            `SELECT COUNT(*) AS total FROM emprestimos
             WHERE id_livro = ? AND status IN ('PENDENTE', 'EMPRESTADO')`,
            [idLivro]
        );
        return Number(rows[0].total);
    }

    // O livro está na mão de alguém agora?
    static async livroEstaEmprestado(idLivro) {
        const rows = await consultar(
            `SELECT COUNT(*) AS total FROM emprestimos
             WHERE id_livro = ? AND status = 'EMPRESTADO'`,
            [idLivro]
        );
        return Number(rows[0].total) > 0;
    }

    // Empréstimos com prazo vencido e livro ainda não devolvido
    static async listarAtrasados(idUsuario) {
        const rows = await consultar(
            `${SELECT_COM_LIVRO}
             WHERE e.id_usuario = ?
               AND e.status = 'EMPRESTADO'
               AND DATE(e.data_devolucao_prevista) < CURDATE()
             ORDER BY e.data_devolucao_prevista ASC`,
            [idUsuario]
        );
        return rows.map(normalizar);
    }

    // Impede pedir de novo um livro que o usuário já tem ou já solicitou
    static async possuiAtivoDoLivro(idUsuario, idLivro) {
        const rows = await consultar(
            `SELECT id_emprestimo, status FROM emprestimos
             WHERE id_usuario = ? AND id_livro = ? AND status IN ('PENDENTE', 'EMPRESTADO')
             LIMIT 1`,
            [idUsuario, idLivro]
        );
        return rows[0] || null;
    }

    // --- LEITURA ---

    static async listarPorUsuario(idUsuario) {
        const rows = await consultar(
            `${SELECT_COM_LIVRO} WHERE e.id_usuario = ? ORDER BY e.data_solicitacao DESC`,
            [idUsuario]
        );
        return rows.map(normalizar);
    }

    static async buscarPorId(idEmprestimo) {
        const rows = await consultar(
            `${SELECT_COM_LIVRO} WHERE e.id_emprestimo = ?`,
            [idEmprestimo]
        );
        return normalizar(rows[0]);
    }

    static async listarTodos({ status = '', pagina = 1, limite = 20 } = {}) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 20, 1), 100);
        const paginaSegura = Math.max(parseInt(pagina) || 1, 1);
        const offset = (paginaSegura - 1) * limiteSeguro;

        const where = status ? 'WHERE e.status = ?' : '';
        const valores = status ? [status] : [];

        const rows = await consultar(
            `${SELECT_COM_LIVRO} ${where}
             ORDER BY e.data_solicitacao DESC
             LIMIT ${limiteSeguro} OFFSET ${offset}`,
            valores
        );

        const totalRows = await consultar(
            `SELECT COUNT(*) AS total FROM emprestimos e ${where}`,
            valores
        );

        const total = Number(totalRows[0].total);

        return {
            emprestimos: rows.map(normalizar),
            total,
            pagina: paginaSegura,
            limite: limiteSeguro,
            totalPaginas: Math.ceil(total / limiteSeguro)
        };
    }

    // Números do painel admin
    static async resumo() {
        const rows = await consultar(`
            SELECT
                (SELECT COUNT(*) FROM livros) AS livros,
                (SELECT COUNT(*) FROM livros WHERE disponivel = 1) AS livros_disponiveis,
                (SELECT COUNT(*) FROM usuarios WHERE tipo = 'cliente') AS usuarios,
                (SELECT COUNT(*) FROM emprestimos WHERE status = 'PENDENTE') AS pendentes,
                (SELECT COUNT(*) FROM emprestimos WHERE status = 'EMPRESTADO') AS emprestados,
                (SELECT COUNT(*) FROM emprestimos
                   WHERE status = 'EMPRESTADO'
                     AND DATE(data_devolucao_prevista) < CURDATE()) AS atrasados
        `);

        const r = rows[0];
        return {
            livros: Number(r.livros),
            livros_disponiveis: Number(r.livros_disponiveis),
            usuarios: Number(r.usuarios),
            pendentes: Number(r.pendentes),
            emprestados: Number(r.emprestados),
            atrasados: Number(r.atrasados)
        };
    }

    // Ranking de livros por número de empréstimos já concedidos.
    // Conta EMPRESTADO e DEVOLVIDO: pedido recusado ou cancelado nunca virou
    // empréstimo, e contá-lo inflaria a popularidade do livro.
    static async maisEmprestados(limite = 5) {
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 5, 1), 20);

        const rows = await consultar(`
            SELECT
                l.id_livro AS id,
                l.titulo,
                l.autor,
                l.capa_url,
                COUNT(*) AS total
            FROM emprestimos e
            INNER JOIN livros l ON l.id_livro = e.id_livro
            WHERE e.status IN ('EMPRESTADO', 'DEVOLVIDO')
            GROUP BY l.id_livro, l.titulo, l.autor, l.capa_url
            ORDER BY total DESC, l.titulo ASC
            LIMIT ${limiteSeguro}
        `);

        return rows.map((linha) => ({ ...linha, total: Number(linha.total) }));
    }

    // Empréstimos concedidos por mês, do mais antigo ao mais recente.
    // A série sai completa (meses sem empréstimo entram com zero) para o
    // gráfico não "pular" períodos e dar impressão errada de continuidade.
    static async porMes(meses = 6) {
        const mesesSeguro = Math.min(Math.max(parseInt(meses) || 6, 1), 24);

        const rows = await consultar(`
            SELECT
                DATE_FORMAT(data_emprestimo, '%Y-%m') AS mes,
                COUNT(*) AS total
            FROM emprestimos
            WHERE data_emprestimo IS NOT NULL
              AND data_emprestimo >= DATE_SUB(CURDATE(), INTERVAL ${mesesSeguro - 1} MONTH)
            GROUP BY mes
        `);

        const contagem = new Map(rows.map((r) => [r.mes, Number(r.total)]));
        const serie = [];
        const hoje = new Date();

        for (let i = mesesSeguro - 1; i >= 0; i--) {
            const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            serie.push({ mes: chave, total: contagem.get(chave) || 0 });
        }

        return serie;
    }

    // --- ESCRITA ---

    static async criarSolicitacao(idUsuario, idLivro) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO emprestimos (id_livro, id_usuario, status) VALUES (?, ?, 'PENDENTE')`,
                [idLivro, idUsuario]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Aprovar marca a data de saída e o prazo; devolver registra a volta.
    // `prazoDias` já chega validado como inteiro pelo controller.
    static async atualizarStatus(idEmprestimo, status, prazoDias = PRAZO_DIAS) {
        let sql;
        let valores;

        if (status === 'EMPRESTADO') {
            sql = `UPDATE emprestimos
                   SET status = 'EMPRESTADO',
                       data_emprestimo = NOW(),
                       data_devolucao_prevista = DATE_ADD(NOW(), INTERVAL ? DAY),
                       data_devolucao_real = NULL
                   WHERE id_emprestimo = ?`;
            valores = [prazoDias, idEmprestimo];
        } else if (status === 'DEVOLVIDO') {
            sql = `UPDATE emprestimos
                   SET status = 'DEVOLVIDO', data_devolucao_real = NOW()
                   WHERE id_emprestimo = ?`;
            valores = [idEmprestimo];
        } else {
            sql = `UPDATE emprestimos SET status = ? WHERE id_emprestimo = ?`;
            valores = [status, idEmprestimo];
        }

        const connection = await getConnection();
        try {
            const [result] = await connection.execute(sql, valores);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Soma dias ao prazo atual (só faz sentido em EMPRESTADO)
    static async estenderPrazo(idEmprestimo, dias) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                `UPDATE emprestimos
                 SET data_devolucao_prevista = DATE_ADD(data_devolucao_prevista, INTERVAL ? DAY)
                 WHERE id_emprestimo = ?`,
                [dias, idEmprestimo]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
}

export default EmprestimoModel;
