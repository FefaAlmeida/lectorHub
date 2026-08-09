const BASE_URL = "http://localhost:3002/api";

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
  const res = await fetch(`${BASE_URL}/auth/perfil`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function atualizarPerfil(data) {
  const res = await fetch(`${BASE_URL}/auth/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}


// EMPRESA
export async function criarEmpresa(data) {
  const res = await fetch(`${BASE_URL}/empresas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getMinhaEmpresa() {
  const res = await fetch(`${BASE_URL}/empresas/minha`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function atualizarEmpresa(id, data) {
  const res = await fetch(`${BASE_URL}/empresas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getMeusEnderecos() {
  const res = await fetch(`${BASE_URL}/empresas/minha/enderecos`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function criarEndereco(data) {
  const res = await fetch(`${BASE_URL}/empresas/minha/enderecos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function atualizarEndereco(id, data) {
  const res = await fetch(`${BASE_URL}/empresas/minha/enderecos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}


// INSTALAÇÃO
export async function solicitarInstalacao(data) {
  const res = await fetch(`${BASE_URL}/instalacoes/solicitar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getMinhasInstalacoes() {
  const res = await fetch(`${BASE_URL}/instalacoes/minhas`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}


// ADMIN
export async function getEmpresas(pagina = 1, limite = 10) {
  const res = await fetch(
    `${BASE_URL}/empresas?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
}

export async function getEmpresa(id) {
  const res = await fetch(`${BASE_URL}/empresas/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function inativarEmpresa(id) {
  const res = await fetch(`${BASE_URL}/empresas/${id}/inativar`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}

// BUSCAR TODAS AS INSTALAÇÕES (ADMIN) - Versão única corrigida e sem duplicidade
export async function getTodasInstalacoes(pagina = 1, limite = 10) {
  const res = await fetch(
    `${BASE_URL}/instalacoes?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
}

// ATUALIZAR INSTALAÇÃO (ADMIN)
export async function atualizarInstalacao(id, dados) {
  const res = await fetch(`${BASE_URL}/instalacoes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dados),
  });

  return res.json();
}


// DASHBOARD CLIENTE

export async function obterDadosGeraisDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard/geral`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  return res.json();
}

export async function getDashboardResumo() {
  const res = await fetch(`${BASE_URL}/dashboard/resumo`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function getDashboardGrafico() {
  const res = await fetch(`${BASE_URL}/dashboard/grafico-monitoramento`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function getDashboardAlertas() {
  const res = await fetch(`${BASE_URL}/dashboard/alertas`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function getDashboardFinanceiro() {
  const res = await fetch(`${BASE_URL}/dashboard/financeiro`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export async function pagarParcela(idPagamento) {
  const res = await fetch(`${BASE_URL}/pagamentos/${idPagamento}/pagar`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}


// ORÇAMENTO
export async function criarOrcamento(data) {
  const res = await fetch(`${BASE_URL}/orcamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

// VALIDAR / BUSCAR DADOS DO ORÇAMENTO PELO TOKEN
export async function validarTokenOrcamento(token) {
  const res = await fetch(`${BASE_URL}/orcamentos/cadastro/${token}`);

  return res.json();
}

// ACEITAR ORÇAMENTO
export async function aceitarOrcamento(id_solicitacao) {
  const res = await fetch(`${BASE_URL}/orcamentos/${id_solicitacao}/aceitar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export async function recusarOrcamento(id_solicitacao) {
  const res = await fetch(`${BASE_URL}/orcamentos/${id_solicitacao}/recusar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}


// FALE CONOSCO
export async function criarFaleConosco(data) {
  const res = await fetch(`${BASE_URL}/faleConosco`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json(); 
}

// BUSCAR TODAS AS MENSAGENS (ADMIN)
export async function getFaleConosco(pagina = 1, limite = 10) {
  const res = await fetch(`${BASE_URL}/faleConosco?pagina=${pagina}&limite=${limite}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  return res.json();
}

// RESPONDER MENSAGEM (ADMIN)
export async function responderFaleConosco(id, resposta) {
  const res = await fetch(`${BASE_URL}/faleConosco/${id}/responder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ resposta }),
  });
  return res.json();
}

// TÉCNICOS (ADM)
// LISTAR TÉCNICOS (PAGINADO)
export async function getTecnicos(pagina = 1, limite = 10) {
  const res = await fetch(
    `${BASE_URL}/tecnicos?pagina=${pagina}&limite=${limite}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
}

// BUSCAR TÉCNICO POR ID
export async function getTecnico(id) {
  const res = await fetch(`${BASE_URL}/tecnicos/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// CADASTRAR NOVO TÉCNICO
export async function criarTecnico(data) {
  const res = await fetch(`${BASE_URL}/tecnicos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

// ATUALIZAR DADOS DO TÉCNICO
export async function atualizarTecnico(id, data) {
  const res = await fetch(`${BASE_URL}/tecnicos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

// INATIVAR TÉCNICO 
export async function inativarTecnico(id) {
  const res = await fetch(`${BASE_URL}/tecnicos/${id}/inativar`, {
    method: "PATCH",
    credentials: "include",
  });

  return res.json();
}



// ==========================================================================
// CHAMADOS
// ==========================================================================

// (Cliente) Abrir um novo chamado
export async function abrirChamado(data) {
  const res = await fetch(`${BASE_URL}/chamados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

// (Cliente) Listar os chamados da empresa autenticada
export async function getMeusChamados(pagina = 1, limite = 10) {
  const res = await fetch(`${BASE_URL}/chamados/meus-chamados?pagina=${pagina}&limite=${limite}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// (Cliente) Cancelar o próprio chamado (Apenas se o status for 'ABERTO')
export async function cancelarChamadoCliente(id) {
  const res = await fetch(`${BASE_URL}/chamados/${id}/cancelar`, {
    method: "PUT",
    credentials: "include",
  });

  return res.json();
}

// (Admin) Listar de forma global todos os chamados do sistema
export async function getTodosChamadosSistema(pagina = 1, limite = 10) {
  const res = await fetch(`${BASE_URL}/chamados/admin?pagina=${pagina}&limite=${limite}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// (Admin) Responder chamado, vincular técnico e definir prioridade
export async function responderChamadoAdmin(id, data) {
  const res = await fetch(`${BASE_URL}/chamados/${id}/responder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}

// (Compartilhado) Buscar detalhes de um chamado específico por ID
export async function getChamadoPorId(id) {
  const res = await fetch(`${BASE_URL}/chamados/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// (Admin) Excluir fisicamente o registro do chamado do banco de dados
export async function excluirRegistroChamado(id) {
  const res = await fetch(`${BASE_URL}/chamados/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
}


// ==========================================================================
// FINANCEIRO (ADM)
// ==========================================================================

// (Admin) Listar de forma global todas as parcelas/pagamentos com indicadores
export async function getFinanceiroAdmin(pagina = 1, limite = 10, status = "", tipo = "") {
  const params = new URLSearchParams({ pagina, limite });
  if (status) params.append("status", status);
  if (tipo) params.append("tipo", tipo);

  const res = await fetch(`${BASE_URL}/financeiro?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

// (Admin) Dar baixa ou reabrir uma parcela (PENDENTE | PAGO | ATRASADO)
export async function atualizarStatusPagamento(id, status_pagamento) {
  const res = await fetch(`${BASE_URL}/financeiro/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status_pagamento }),
  });

  return res.json();
}