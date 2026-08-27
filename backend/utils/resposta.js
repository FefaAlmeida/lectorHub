// Formato único de erro da API: { sucesso: false, mensagem, codigo? }
export function erro(res, status, mensagem, codigo) {
    const corpo = { sucesso: false, mensagem };
    if (codigo) corpo.codigo = codigo;
    return res.status(status).json(corpo);
}

// 500 padrão: loga o detalhe no servidor e devolve mensagem genérica.
export function erroInterno(res, contexto, error) {
    console.error(`Erro em ${contexto}:`, error);
    return erro(res, 500, 'Erro interno do servidor');
}
