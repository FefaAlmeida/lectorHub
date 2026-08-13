import db from "../config/database.js";

export const livroModel = {
  async buscarPorId(id) {
    const query = `
      SELECT 
        l.id,
        l.titulo,
        l.autor,
        l.capa_url,
        l.sinopse,
        l.quantidade_disponivel,
        l.editora,
        l.ano_publicacao,
        l.paginas,
        l.idioma,
        l.faixa_etaria,
        l.localizacao,
        c.id AS categoria_id,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN categorias c ON l.categoria_id = c.id
      WHERE l.id = $1;
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  },

  async buscarSemelhantes(categoriaId, idLivroAtual, limite = 4) {
    const query = `
      SELECT 
        id, 
        titulo, 
        autor, 
        capa_url 
      FROM livros
      WHERE categoria_id = $1 AND id != $2
      LIMIT $3;
    `;

    const { rows } = await db.query(query, [categoriaId, idLivroAtual, limite]);
    return rows;
  },

  async atualizarEstoque(id, novaQuantidade) {
    const query = `
      UPDATE livros
      SET quantidade_disponivel = $1
      WHERE id = $2
      RETURNING id, quantidade_disponivel;
    `;

    const { rows } = await db.query(query, [novaQuantidade, id]);
    return rows[0];
  },

  async obterEstatisticasAvaliacoes(idLivro) {
    const query = `
      SELECT
        COUNT(*)::INTEGER AS total_avaliacoes,
        COALESCE(ROUND(AVG(nota)::numeric, 1), 0.0) AS media_notas,
        COUNT(CASE WHEN nota = 5 THEN 1 END)::INTEGER AS cinco_estrelas,
        COUNT(CASE WHEN nota = 4 THEN 1 END)::INTEGER AS quatro_estrelas,
        COUNT(CASE WHEN nota = 3 THEN 1 END)::INTEGER AS tres_estrelas,
        COUNT(CASE WHEN nota = 2 THEN 1 END)::INTEGER AS duas_estrelas,
        COUNT(CASE WHEN nota = 1 THEN 1 END)::INTEGER AS uma_estrela
      FROM avaliacoes
      WHERE livro_id = $1;
    `;

    const { rows } = await db.query(query, [idLivro]);
    return rows[0];
  }
};