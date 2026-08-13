import {
    create,
    read,
    update,
    deleteRecord,
    getConnection
} from '../config/database.js';

class EmprestimoModel {

    // 1. CREATE - Registrar um novo empréstimo
    static async registrarEmprestimo(dadosEmprestimo) {
        try {
            const payload = {
                id_livro: dadosEmprestimo.id_livro,
                id_usuario: dadosEmprestimo.id_usuario,
                data_emprestimo: dadosEmprestimo.data_emprestimo || null,
                data_devolucao_prevista: dadosEmprestimo.data_devolucao_prevista || null,
                status: dadosEmprestimo.status || 'PENDENTE'
            };

            return await create('emprestimos', payload);

        } catch (error) {
            console.error(
                'Erro ao registrar empréstimo no Model:',
                error
            );
            throw error;
        }
    }

   static async emprestado(id_usuario) {
    const connection = await getConnection();

    try {
        const sql = `
            SELECT
                e.id_emprestimo,
                e.id_livro,
                e.id_usuario,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.status
            FROM emprestimos e
            WHERE e.id_usuario = ?
              AND e.status = 'EMPRESTADO'
        `;

        const [resultado] = await connection.execute(
            sql,
            [id_usuario]
        );

        return resultado[0] || null;

    } catch (error) {
        console.error(
            'Erro ao verificar se o usuário possui empréstimo:',
            error
        );
        throw error;

    } finally {
        connection.release();
    }
}


    // 2. READ - Total de livros atualmente emprestados
    static async totalEmprestados() {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT COUNT(*) AS total
                FROM emprestimos
                WHERE status = 'EMPRESTADO'
            `;

            const [resultado] = await connection.execute(sql);

            return Number(resultado[0].total);

        } catch (error) {
            console.error(
                'Erro ao buscar total de empréstimos:',
                error
            );
            throw error;

        } finally {
            connection.release();
        }
    }

  static async livroEmAtraso(id_emprestimo) {
    const connection = await getConnection();

    try {
        const sql = `
            SELECT
                e.id_emprestimo,
                e.id_livro,
                e.id_usuario,
                e.data_devolucao_prevista,
                e.status
            FROM emprestimos e
            WHERE e.id_emprestimo = ?
              AND e.status = 'EMPRESTADO'
              AND e.data_devolucao_prevista < NOW()
        `;

        const [resultado] = await connection.execute(
            sql,
            [id_emprestimo]
        );

        return resultado[0] || null;

    } catch (error) {
        console.error(
            'Erro ao verificar se o empréstimo está atrasado:',
            error
        );
        throw error;

    } finally {
        connection.release();
    }
}

    static async buscarUltimoPorUsuario(id_usuario) {
    const connection = await getConnection();

    try {
        const sql = `
            SELECT
                e.id_emprestimo,
                e.id_usuario,
                e.id_livro,
                e.data_solicitacao,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status,

                l.titulo,
                l.autor,
                l.categoria,
                l.ano_publicacao,
                l.capa_url

            FROM emprestimos e
            INNER JOIN livros l
                ON e.id_livro = l.id_livro

            WHERE e.id_usuario = ?
            ORDER BY e.data_solicitacao DESC
            LIMIT 1
        `;

        const [resultado] = await connection.execute(sql, [id_usuario]);

        // Retorna diretamente o objeto do empréstimo (ou null caso não exista)
        return resultado[0] || null;

    } catch (error) {
        console.error(
            'Erro ao buscar último empréstimo do usuário:',
            error
        );
        throw error;

    } finally {
        connection.release();
    }
}

}

export default EmprestimoModel;