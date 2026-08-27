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

const COLUNAS = `
    id_livro AS id,
    titulo,
    autor,
    categoria,
    sinopse,
    ano_publicacao,
    disponivel,
    capa_url
`;

// Campos que o admin pode gravar (na ordem: nome no JSON = nome da coluna)
const CAMPOS_EDITAVEIS = ['titulo', 'autor', 'categoria', 'sinopse', 'ano_publicacao', 'capa_url', 'disponivel'];

async function consultar(sql, valores = []) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(sql, valores);
        return rows;
    } finally {
        connection.release();
    }
}

export const livroModel = {

    async listar({
        busca = '',
        categoria = '',
        disponivel = null,
        ordem = 'titulo_asc',
        pagina = 1,
        limite = 12
    } = {}) {
        // LIMIT/OFFSET não aceitam placeholder em prepared statement no MySQL.
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

        const livros = await consultar(
            `SELECT ${COLUNAS} FROM livros ${where} ORDER BY ${orderBy} LIMIT ${limiteSeguro} OFFSET ${offset}`,
            valores
        );
        const totalRows = await consultar(`SELECT COUNT(*) AS total FROM livros ${where}`, valores);
        const total = Number(totalRows[0].total);

        return {
            livros: livros.map(normalizar),
            total,
            pagina: paginaSegura,
            limite: limiteSeguro,
            totalPaginas: Math.ceil(total / limiteSeguro)
        };
    },

    async listarCategorias() {
        const rows = await consultar(
            `SELECT DISTINCT categoria FROM livros
             WHERE categoria IS NOT NULL AND categoria <> ''
             ORDER BY categoria ASC`
        );
        return rows.map((linha) => linha.categoria);
    },

    async buscarPorId(id) {
        const rows = await consultar(`SELECT ${COLUNAS} FROM livros WHERE id_livro = ?`, [id]);
        return normalizar(rows[0]) || null;
    },

    async buscarSemelhantes(categoria, idLivroAtual, limite = 4) {
        if (!categoria) return [];
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 4, 1), 20);

        const rows = await consultar(
            `SELECT id_livro AS id, titulo, autor, capa_url, disponivel
             FROM livros
             WHERE categoria = ? AND id_livro != ?
             ORDER BY titulo ASC
             LIMIT ${limiteSeguro}`,
            [categoria, idLivroAtual]
        );
        return rows.map(normalizar);
    },

    // --- ESCRITA (admin) ---

    async criar(dados) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO livros (titulo, autor, categoria, sinopse, ano_publicacao, capa_url, disponivel)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    dados.titulo,
                    dados.autor,
                    dados.categoria,
                    dados.sinopse ?? null,
                    dados.ano_publicacao,
                    dados.capa_url ?? null,
                    dados.disponivel === false ? 0 : 1
                ]
            );
            return this.buscarPorId(result.insertId);
        } finally {
            connection.release();
        }
    },

    // Atualiza só os campos presentes em `dados`
    async atualizar(id, dados) {
        const campos = [];
        const valores = [];

        for (const campo of CAMPOS_EDITAVEIS) {
            if (dados[campo] !== undefined) {
                campos.push(`${campo} = ?`);
                valores.push(campo === 'disponivel' ? (dados[campo] ? 1 : 0) : dados[campo]);
            }
        }

        if (campos.length === 0) return this.buscarPorId(id);

        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                `UPDATE livros SET ${campos.join(', ')} WHERE id_livro = ?`,
                [...valores, id]
            );
            if (result.affectedRows === 0) return null;
            return this.buscarPorId(id);
        } finally {
            connection.release();
        }
    },

    async atualizarDisponibilidade(id, disponivel) {
        return this.atualizar(id, { disponivel });
    },

    async excluir(id) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM livros WHERE id_livro = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
};
