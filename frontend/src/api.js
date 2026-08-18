const BASE_URL = "http://localhost:3001/api";

// REGISTRO
export async function criarUsuario(data) {
  const res = await fetch(`${BASE_URL}/auth/criarUsuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

// LOGIN
export async function loginUsuario(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

// LOGOUT
export async function logoutUsuario() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}

// SOLICITAR REDEFINIÇÃO DE SENHA
export async function solicitarRedefinicaoSenha(email) {
  const res = await fetch(`${BASE_URL}/auth/solicitar-redefinicao-senha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return res.json();
}

// REDEFINIR SENHA
export async function redefinirSenha(token, senha) {
  const res = await fetch(`${BASE_URL}/auth/redefinir-senha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, senha }),
  });

  return res.json();
}

// PERFIL
export async function getPerfil() {
  const res = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function atualizarPerfil(data) {
  const res = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}


// USUÁRIOS (ADMIN)
export async function getUsuarios(pagina = 1, limite = 10) {
  const res = await fetch(
    `${BASE_URL}/usuarios?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
}

// LIVROS
// filtros aceitos: { busca, categoria, disponivel, pagina, limite }
export async function getLivros(filtros = {}) {
  const query = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      query.append(chave, valor);
    }
  });

  const queryString = query.toString();

  const res = await fetch(
    `${BASE_URL}/livros${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/livros/categorias`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function getLivroPorId(id) {
  const res = await fetch(`${BASE_URL}/livros/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function atualizarDisponibilidade(id, disponivel) {
  const res = await fetch(`${BASE_URL}/livros/${id}/disponibilidade`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ disponivel }),
  });

  return res.json();
}


// AVALIAÇÕES
export async function getAvaliacoes(idLivro) {
  const res = await fetch(`${BASE_URL}/livros/${idLivro}/avaliacoes`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// Cria ou atualiza a avaliação do usuário logado (uma por livro).
export async function salvarAvaliacao(idLivro, { nota, comentario }) {
  const res = await fetch(`${BASE_URL}/livros/${idLivro}/avaliacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ nota, comentario }),
  });

  return res.json();
}

export async function excluirAvaliacao(idLivro) {
  const res = await fetch(`${BASE_URL}/livros/${idLivro}/avaliacoes`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
}

// EMPRÉSTIMOS
export async function getUltimoEmprestimo(id_usuario) {
  const res = await fetch(`${BASE_URL}/emprestimos/ultimo/${id_usuario}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// Lista os empréstimos do usuário logado junto com a situação dele
// perante as regras (limite de 2 ativos e bloqueio por atraso).
export async function getMeusEmprestimos() {
  const res = await fetch(`${BASE_URL}/emprestimos/meus`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function getElegibilidade() {
  const res = await fetch(`${BASE_URL}/emprestimos/elegibilidade`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function solicitarEmprestimo(id_livro) {
  const res = await fetch(`${BASE_URL}/emprestimos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id_livro }),
  });

  return res.json();
}

export async function cancelarEmprestimo(id_emprestimo) {
  const res = await fetch(`${BASE_URL}/emprestimos/${id_emprestimo}/cancelar`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}

// ADMIN: aprovar ("EMPRESTADO"), recusar, registrar devolução...
export async function atualizarStatusEmprestimo(id_emprestimo, status) {
  const res = await fetch(`${BASE_URL}/emprestimos/${id_emprestimo}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return res.json();
}

export async function atualizarUsuario(id, data) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  
  

  return res.json();
}
