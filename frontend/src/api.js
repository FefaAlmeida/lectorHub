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
