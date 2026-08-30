import { getConnection } from '../config/database.js';

// Tabela `livros` (migrations 20260804_002, _006 e 20260827_010):
//   id_livro INT PK AI | titulo | autor | categoria_id FK | sinopse NULL
//   ano_publicacao | disponivel BOOLEAN DEFAULT TRUE | capa_url NULL
// O alias `id_livro AS id` segue o mesmo contrato de UsuarioModel.
//
// A categoria virou FK para `categorias` (migration 010). Toda leitura faz
// JOIN e expõe DOIS campos: `categoria_id` (para gravar/filtrar) e `categoria`
// (o nome, para exibir) — assim quem consome a API não precisa de outra ida
// ao servidor só para mostrar o rótulo.

// MySQL devolve BOOLEAN como TINYINT (1/0); o front espera booleano de verdade.
function normalizar(livro) {
    return livro && { ...livro, disponivel: Boolean(livro.disponivel) };
}

// Whitelist: o valor vira SQL cru, então nunca pode vir direto do usuário.
// Prefixado com `l.` porque as consultas agora fazem JOIN.
const ORDENACOES = {
    titulo_asc: 'l.titulo ASC',
    titulo_desc: 'l.titulo DESC',
    recentes: 'l.ano_publicacao DESC, l.titulo ASC'
};

const COLUNAS = `
    l.id_livro AS id,
    l.titulo,
    l.autor,
    l.categoria_id,
    c.nome AS categoria,
    l.sinopse,
    l.ano_publicacao,
    l.disponivel,
    l.capa_url
`;

// INNER JOIN e não LEFT: categoria_id é NOT NULL com FK, então todo livro tem
// categoria. Um LEFT aqui esconderia inconsistência em vez de denunciá-la.
const DE = 'FROM livros l INNER JOIN categorias c ON c.id_categoria = l.categoria_id';

// Campos que o admin pode gravar (nome no JSON = nome da coluna)
const CAMPOS_EDITAVEIS = ['titulo', 'autor', 'categoria_id', 'sinopse', 'ano_publicacao', 'capa_url', 'disponivel'];

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
        categoriaId = null,
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
            filtros.push('(l.titulo LIKE ? OR l.autor LIKE ? OR c.nome LIKE ?)');
            const termo = `%${busca}%`;
            valores.push(termo, termo, termo);
        }

        // Filtrar por id é o caminho normal; o nome continua aceito para
        // links antigos e para quem chama a API na mão.
        if (categoriaId) {
            filtros.push('l.categoria_id = ?');
            valores.push(categoriaId);
        } else if (categoria) {
            filtros.push('c.nome = ?');
            valores.push(categoria);
        }

        if (disponivel !== null) {
            filtros.push('l.disponivel = ?');
            valores.push(disponivel ? 1 : 0);
        }

        const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
        const orderBy = ORDENACOES[ordem] || ORDENACOES.titulo_asc;

        const livros = await consultar(
            `SELECT ${COLUNAS} ${DE} ${where} ORDER BY ${orderBy} LIMIT ${limiteSeguro} OFFSET ${offset}`,
            valores
        );
        const totalRows = await consultar(`SELECT COUNT(*) AS total ${DE} ${where}`, valores);
        const total = Number(totalRows[0].total);

        return {
            livros: livros.map(normalizar),
            total,
            pagina: paginaSegura,
            limite: limiteSeguro,
            totalPaginas: Math.ceil(total / limiteSeguro)
        };
    },

    async buscarPorId(id) {
        const rows = await consultar(`SELECT ${COLUNAS} ${DE} WHERE l.id_livro = ?`, [id]);
        return normalizar(rows[0]) || null;
    },

    async buscarSemelhantes(categoriaId, idLivroAtual, limite = 4) {
        if (!categoriaId) return [];
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 4, 1), 20);

        const rows = await consultar(
            `SELECT l.id_livro AS id, l.titulo, l.autor, l.capa_url, l.disponivel
             ${DE}
             WHERE l.categoria_id = ? AND l.id_livro != ?
             ORDER BY l.titulo ASC
             LIMIT ${limiteSeguro}`,
            [categoriaId, idLivroAtual]
        );
        return rows.map(normalizar);
    },

    // Livros mais emprestados (só empréstimos concedidos contam).
    // Se a biblioteca ainda não tem histórico, cai para os mais recentes —
    // senão a vitrine da home nasceria vazia num acervo novo.
    async populares(limite = 4) {
        const limiteSeguro = Math.min(Math.max(parseInt(limite) || 4, 1), 20);

        const rows = await consultar(
            `SELECT ${COLUNAS}, COUNT(e.id_emprestimo) AS total_emprestimos
             ${DE}
             INNER JOIN emprestimos e
                ON e.id_livro = l.id_livro AND e.status IN ('EMPRESTADO', 'DEVOLVIDO')
             GROUP BY l.id_livro, l.titulo, l.autor, l.categoria_id, c.nome,
                      l.sinopse, l.ano_publicacao, l.disponivel, l.capa_url
             ORDER BY total_emprestimos DESC, l.titulo ASC
             LIMIT ${limiteSeguro}`
        );

        if (rows.length > 0) {
            return {
                criterio: 'populares',
                livros: rows.map((r) => normalizar({ ...r, total_emprestimos: Number(r.total_emprestimos) }))
            };
        }

        const recentes = await consultar(
            `SELECT ${COLUNAS} ${DE} ORDER BY l.ano_publicacao DESC, l.titulo ASC LIMIT ${limiteSeguro}`
        );

        return { criterio: 'recentes', livros: recentes.map(normalizar) };
    },

    // --- ESCRITA (admin) ---

    async criar(dados) {
        const connection = await getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO livros (titulo, autor, categoria_id, sinopse, ano_publicacao, capa_url, disponivel)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    dados.titulo,
                    dados.autor,
                    dados.categoria_id,
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
