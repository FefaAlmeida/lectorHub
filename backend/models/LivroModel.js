import { getConnection } from '../config/database.js';

// Tabela `livros` (migrations 20260804_002 e 20260804_006):
//   id_livro INT PK AI | titulo | autor | categoria | sinopse NULL
//   ano_publicacao | disponivel BOOLEAN DEFAULT TRUE | capa_url NULL
// O alias `id_livro AS id` segue o mesmo contrato de UsuarioModel.

// MySQL devolve BOOLEAN como TINYINT (1/0); o front espera booleano de verdade.
function normalizar(livro) {
    return livro && { ...livro, disponivel: Boolean(livro.disponivel) };
}

// Whitelist: o valor vira SQL cru, então nunca pode vir direto do usuário.
const ORDENACOES = {
    titulo_asc: 'titulo ASC',
    titulo_desc: 'titulo DESC',
    recentes: 'ano_publicacao DESC, titulo ASC'
};

export const livroModel = {

    // LISTAR COM BUSCA, FILTROS E PAGINAÇÃO
    async listar({
        busca = '',
        categoria = '',
        disponivel = null,
        ordem = 'titulo_asc',
        pagina = 1,
        limite = 12
    } = {}) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL,
        // por isso são interpolados — sempre como inteiros sanitizados.
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 12, 1), 100);
        const paginaSegura = Math.max(parseInt(pagina) || 1, 1);
        const offset = (paginaSegura - 1) * limiteSeguro;

        const filtros = [];
        const valores = [];

        if (busca) {
            filtros.push('(titulo LIKE ? OR autor LIKE ? OR categoria LIKE ?)');
            const termo = `%${busca}%`;
            valores.push(termo, termo, termo);
        }

        if (categoria) {
            filtros.push('categoria = ?');
            valores.push(categoria);
        }

        if (disponivel !== null) {
            filtros.push('disponivel = ?');
            valores.push(disponivel ? 1 : 0);
        }

        const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
        const orderBy = ORDENACOES[ordem] || ORDENACOES.titulo_asc;

        const connection = await getConnection();

        try {
            const [livros] = await connection.execute(
                `
                SELECT
                    id_livro AS id,
                    titulo,
                    autor,
                    categoria,
                    ano_publicacao,
                    disponivel,
                    capa_url
                FROM livros
                ${where}
                ORDER BY ${orderBy}
                LIMIT ${limiteSeguro} OFFSET ${offset}
                `,
                valores
            );

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) AS total FROM livros ${where}`,
                valores
            );

            return {
                livros: livros.map(normalizar),
                total: totalResult[0].total,
                pagina: paginaSegura,
                limite: limiteSeguro,
                totalPaginas: Math.ceil(totalResult[0].total / limiteSeguro)
            };

        } finally {
            connection.release();
        }
    },

    // CATEGORIAS EXISTENTES (alimenta o filtro da tela de busca)
    async listarCategorias() {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT DISTINCT categoria
                FROM livros
                WHERE categoria IS NOT NULL AND categoria <> ''
                ORDER BY categoria ASC
                `
            );

            return rows.map((linha) => linha.categoria);

        } finally {
            connection.release();
        }
    },

    // BUSCAR POR ID
    async buscarPorId(id) {
        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT
                    id_livro AS id,
                    titulo,
                    autor,
                    categoria,
                    sinopse,
                    ano_publicacao,
                    disponivel,
                    capa_url
                FROM livros
                WHERE id_livro = ?
                `,
                [id]
            );

            return normalizar(rows[0]) || null;

        } finally {
            connection.release();
        }
    },

    // OUTROS LIVROS DA MESMA CATEGORIA
    async buscarSemelhantes(categoria, idLivroAtual, limite = 4) {
        if (!categoria) return [];

        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 4, 1), 20);

        const connection = await getConnection();

        try {
            const [rows] = await connection.execute(
                `
                SELECT
                    id_livro AS id,
                    titulo,
                    autor,
                    capa_url,
                    disponivel
                FROM livros
                WHERE categoria = ? AND id_livro != ?
                ORDER BY titulo ASC
                LIMIT ${limiteSeguro}
                `,
                [categoria, idLivroAtual]
            );

            return rows.map(normalizar);

        } finally {
            connection.release();
        }
    },

    // MARCAR COMO DISPONÍVEL / INDISPONÍVEL
    async atualizarDisponibilidade(id, disponivel) {
        const connection = await getConnection();

        try {
            const [result] = await connection.execute(
                'UPDATE livros SET disponivel = ? WHERE id_livro = ?',
                [disponivel ? 1 : 0, id]
            );

            if (result.affectedRows === 0) return null;

            return this.buscarPorId(id);

        } finally {
            connection.release();
        }
    }
};
