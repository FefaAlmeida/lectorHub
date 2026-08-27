// Configure NEXT_PUBLIC_API_URL no .env.local (ver .env.example).
// O fallback só serve para desenvolvimento local.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "");
const BASE_URL = `${API_URL}/api`;

// Toda chamada passa por aqui: envia o cookie de sessão, serializa o body
// e garante que a resposta seja SEMPRE um objeto { sucesso, mensagem, ... }
// — mesmo quando o servidor cai ou devolve algo que não é JSON.
async function requisitar(caminho, { method = "GET", body } = {}) {
  try {
    const res = await fetch(`${BASE_URL}${caminho}`, {
      method,
      credentials: "include",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    try {
      return await res.json();
    } catch {
      return { sucesso: false, mensagem: `Resposta inválida do servidor (HTTP ${res.status}).` };
    }
  } catch {
    return { sucesso: false, mensagem: "Não foi possível conectar ao servidor.", codigo: "SEM_CONEXAO" };
  }
}

function query(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

// AUTENTICAÇÃO
export const criarUsuario = (data) => requisitar("/auth/criarUsuario", { method: "POST", body: data });
export const loginUsuario = (data) => requisitar("/auth/login", { method: "POST", body: data });
export const logoutUsuario = () => requisitar("/auth/logout", { method: "POST" });
export const solicitarRedefinicaoSenha = (email) =>
  requisitar("/auth/solicitar-redefinicao-senha", { method: "POST", body: { email } });
export const redefinirSenha = (token, senha) =>
  requisitar("/auth/redefinir-senha", { method: "POST", body: { token, senha } });

// PERFIL
export const getPerfil = () => requisitar("/usuarios/me");
export const atualizarPerfil = (data) => requisitar("/usuarios/me", { method: "PUT", body: data });

// USUÁRIOS (ADMIN)
export const getUsuarios = (pagina = 1, limite = 10) => requisitar(`/usuarios${query({ pagina, limite })}`);
export const atualizarUsuario = (id, data) => requisitar(`/usuarios/${id}`, { method: "PUT", body: data });

// LIVROS — filtros: { busca, categoria, disponivel, ordem, pagina, limite }
export const getLivros = (filtros = {}) => requisitar(`/livros${query(filtros)}`);
export const getCategorias = () => requisitar("/livros/categorias");
export const getLivroPorId = (id) => requisitar(`/livros/${id}`);

// LIVROS (ADMIN)
export const criarLivro = (data) => requisitar("/livros", { method: "POST", body: data });
export const atualizarLivro = (id, data) => requisitar(`/livros/${id}`, { method: "PUT", body: data });
export const excluirLivro = (id) => requisitar(`/livros/${id}`, { method: "DELETE" });
export const atualizarDisponibilidade = (id, disponivel) =>
  requisitar(`/livros/${id}/disponibilidade`, { method: "PUT", body: { disponivel } });

// AVALIAÇÕES
export const getAvaliacoes = (idLivro) => requisitar(`/livros/${idLivro}/avaliacoes`);
export const salvarAvaliacao = (idLivro, { nota, comentario }) =>
  requisitar(`/livros/${idLivro}/avaliacoes`, { method: "POST", body: { nota, comentario } });
export const excluirAvaliacao = (idLivro) => requisitar(`/livros/${idLivro}/avaliacoes`, { method: "DELETE" });

// EMPRÉSTIMOS (CLIENTE)
export const getMeusEmprestimos = () => requisitar("/emprestimos/meus");
export const getElegibilidade = () => requisitar("/emprestimos/elegibilidade");
export const solicitarEmprestimo = (id_livro) => requisitar("/emprestimos", { method: "POST", body: { id_livro } });
export const cancelarEmprestimo = (id) => requisitar(`/emprestimos/${id}/cancelar`, { method: "PATCH" });

// EMPRÉSTIMOS (ADMIN)
export const getEmprestimosAdmin = (filtros = {}) => requisitar(`/emprestimos${query(filtros)}`);
export const getResumoAdmin = () => requisitar("/emprestimos/resumo");
// status: EMPRESTADO (aprovar, aceita prazo_dias) | RECUSADO | DEVOLVIDO
export const atualizarStatusEmprestimo = (id, status, prazo_dias) =>
  requisitar(`/emprestimos/${id}/status`, { method: "PATCH", body: { status, prazo_dias } });
export const estenderPrazo = (id, dias) => requisitar(`/emprestimos/${id}/prazo`, { method: "PATCH", body: { dias } });
